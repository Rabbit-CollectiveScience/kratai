import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { ClassInfo, PropertyInfo, MethodInfo, DiagramData, ClassRelationship } from '../types/diagram';

export class CodeParserService {
	
	static async parseWorkspace(workspacePath: string): Promise<DiagramData> {
		const classes: ClassInfo[] = [];
		const relationships: ClassRelationship[] = [];

		// Find all TypeScript files in src folder
		const srcPath = path.join(workspacePath, 'src');
		if (!fs.existsSync(srcPath)) {
			throw new Error('No src folder found in workspace');
		}

		const files = this.findTypeScriptFiles(srcPath);

		for (const file of files) {
			const fileClasses = this.parseFile(file);
			classes.push(...fileClasses);
		}

		// Extract relationships
		const classNames = new Set(classes.map(c => c.name));
		
		for (const classInfo of classes) {
			if (classInfo.extends) {
				relationships.push({
					from: classInfo.name,
					to: classInfo.extends,
					type: 'extends'
				});
			}

			if (classInfo.implements) {
				for (const interfaceName of classInfo.implements) {
					relationships.push({
						from: classInfo.name,
						to: interfaceName,
						type: 'implements'
					});
				}
			}

			// Extract dependencies from properties
			const dependencies = new Set<string>();
			
			for (const prop of classInfo.properties) {
				const types = this.extractTypeNames(prop.type);
				types.forEach(type => {
					if (classNames.has(type) && type !== classInfo.name) {
						dependencies.add(type);
					}
				});
			}

			// Extract dependencies from method parameters and return types
			for (const method of classInfo.methods) {
				for (const param of method.parameters) {
					const types = this.extractTypeNames(param.type);
					types.forEach(type => {
						if (classNames.has(type) && type !== classInfo.name) {
							dependencies.add(type);
						}
					});
				}
				
				const returnTypes = this.extractTypeNames(method.returnType);
				returnTypes.forEach(type => {
					if (classNames.has(type) && type !== classInfo.name) {
						dependencies.add(type);
					}
				});
			}

			// Add 'uses' relationships for dependencies
			dependencies.forEach(dep => {
				// Don't add 'uses' if there's already an 'extends' or 'implements' relationship
				const hasStrongerRelationship = relationships.some(
					r => r.from === classInfo.name && r.to === dep && (r.type === 'extends' || r.type === 'implements')
				);
				
				if (!hasStrongerRelationship) {
					relationships.push({
						from: classInfo.name,
						to: dep,
						type: 'uses'
					});
				}
			});
		}

		return { classes, relationships };
	}

	private static findTypeScriptFiles(dir: string): string[] {
		const files: string[] = [];
		
		const items = fs.readdirSync(dir);
		for (const item of items) {
			const fullPath = path.join(dir, item);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				// Skip node_modules, test folders
				if (item !== 'node_modules' && item !== 'test' && !item.startsWith('.')) {
					files.push(...this.findTypeScriptFiles(fullPath));
				}
			} else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
				files.push(fullPath);
			}
		}

		return files;
	}

	private static parseFile(filePath: string): ClassInfo[] {
		const classes: ClassInfo[] = [];
		const sourceCode = fs.readFileSync(filePath, 'utf-8');
		const sourceFile = ts.createSourceFile(
			filePath,
			sourceCode,
			ts.ScriptTarget.Latest,
			true
		);

		const visit = (node: ts.Node) => {
			if (ts.isClassDeclaration(node) && node.name) {
				const classInfo = this.extractClassInfo(node, filePath);
				classes.push(classInfo);
			} else if (ts.isInterfaceDeclaration(node)) {
				const interfaceInfo = this.extractInterfaceInfo(node, filePath);
				classes.push(interfaceInfo);
			}

			ts.forEachChild(node, visit);
		};

		visit(sourceFile);
		return classes;
	}

	private static extractTypeNames(typeString: string): string[] {
		// Extract class names from type strings
		// Handle cases like: "MyClass", "MyClass[]", "MyClass | null", "Array<MyClass>", etc.
		const types: string[] = [];
		
		// Remove common non-class type keywords
		const nonClassTypes = new Set(['string', 'number', 'boolean', 'void', 'any', 'unknown', 'never', 'null', 'undefined', 'Promise', 'Array', 'Map', 'Set']);
		
		// Extract identifiers (words that start with uppercase letter)
		const identifierRegex = /\b([A-Z][a-zA-Z0-9]*)\b/g;
		let match;
		
		while ((match = identifierRegex.exec(typeString)) !== null) {
			const typeName = match[1];
			if (!nonClassTypes.has(typeName)) {
				types.push(typeName);
			}
		}
		
		return types;
	}

	private static extractClassInfo(node: ts.ClassDeclaration, filePath: string): ClassInfo {
		const name = node.name?.getText() || 'Anonymous';
		const properties: PropertyInfo[] = [];
		const methods: MethodInfo[] = [];
		let extendsClass: string | undefined;
		const implementsInterfaces: string[] = [];

		// Check for extends
		if (node.heritageClauses) {
			for (const clause of node.heritageClauses) {
				if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
					extendsClass = clause.types[0]?.expression.getText();
				} else if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
					for (const type of clause.types) {
						implementsInterfaces.push(type.expression.getText());
					}
				}
			}
		}

		// Extract members
		for (const member of node.members) {
			if (ts.isPropertyDeclaration(member)) {
				properties.push(this.extractProperty(member));
			} else if (ts.isMethodDeclaration(member)) {
				methods.push(this.extractMethod(member));
			} else if (ts.isConstructorDeclaration(member)) {
				methods.push(this.extractConstructor(member));
			}
		}

		return {
			name,
			filePath,
			properties,
			methods,
			extends: extendsClass,
			implements: implementsInterfaces.length > 0 ? implementsInterfaces : undefined,
			isAbstract: node.modifiers?.some(m => m.kind === ts.SyntaxKind.AbstractKeyword)
		};
	}

	private static extractInterfaceInfo(node: ts.InterfaceDeclaration, filePath: string): ClassInfo {
		const name = node.name.getText();
		const properties: PropertyInfo[] = [];
		const methods: MethodInfo[] = [];
		const implementsInterfaces: string[] = [];

		// Check for extends
		if (node.heritageClauses) {
			for (const clause of node.heritageClauses) {
				for (const type of clause.types) {
					implementsInterfaces.push(type.expression.getText());
				}
			}
		}

		// Extract members
		for (const member of node.members) {
			if (ts.isPropertySignature(member)) {
				const prop = this.extractPropertySignature(member);
				properties.push(prop);
			} else if (ts.isMethodSignature(member)) {
				const method = this.extractMethodSignature(member);
				methods.push(method);
			}
		}

		return {
			name,
			filePath,
			properties,
			methods,
			implements: implementsInterfaces.length > 0 ? implementsInterfaces : undefined,
			isInterface: true
		};
	}

	private static extractProperty(node: ts.PropertyDeclaration): PropertyInfo {
		const name = node.name.getText();
		const type = node.type?.getText() || 'any';
		const visibility = this.getVisibility(node);
		const isStatic = node.modifiers?.some(m => m.kind === ts.SyntaxKind.StaticKeyword) || false;
		const isReadonly = node.modifiers?.some(m => m.kind === ts.SyntaxKind.ReadonlyKeyword) || false;

		return { name, type, visibility, isStatic, isReadonly };
	}

	private static extractPropertySignature(node: ts.PropertySignature): PropertyInfo {
		const name = node.name.getText();
		const type = node.type?.getText() || 'any';

		return { name, type, visibility: 'public' };
	}

	private static extractMethod(node: ts.MethodDeclaration): MethodInfo {
		const name = node.name.getText();
		const parameters = node.parameters.map(p => ({
			name: p.name.getText(),
			type: p.type?.getText() || 'any',
			optional: !!p.questionToken
		}));
		const returnType = node.type?.getText() || 'void';
		const visibility = this.getVisibility(node);
		const isStatic = node.modifiers?.some(m => m.kind === ts.SyntaxKind.StaticKeyword) || false;
		const isAsync = node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword) || false;

		return { name, parameters, returnType, visibility, isStatic, isAsync };
	}

	private static extractMethodSignature(node: ts.MethodSignature): MethodInfo {
		const name = node.name.getText();
		const parameters = node.parameters.map(p => ({
			name: p.name.getText(),
			type: p.type?.getText() || 'any',
			optional: !!p.questionToken
		}));
		const returnType = node.type?.getText() || 'void';

		return { name, parameters, returnType, visibility: 'public' };
	}

	private static extractConstructor(node: ts.ConstructorDeclaration): MethodInfo {
		const parameters = node.parameters.map(p => ({
			name: p.name.getText(),
			type: p.type?.getText() || 'any',
			optional: !!p.questionToken
		}));

		return {
			name: 'constructor',
			parameters,
			returnType: 'void',
			visibility: 'public'
		};
	}

	private static getVisibility(node: ts.PropertyDeclaration | ts.MethodDeclaration): 'public' | 'private' | 'protected' {
		if (node.modifiers?.some(m => m.kind === ts.SyntaxKind.PrivateKeyword)) {
			return 'private';
		}
		if (node.modifiers?.some(m => m.kind === ts.SyntaxKind.ProtectedKeyword)) {
			return 'protected';
		}
		return 'public';
	}
}
