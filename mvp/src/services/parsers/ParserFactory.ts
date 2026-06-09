import * as path from 'path';
import { IParserStrategy } from './IParserStrategy';
import { TypeScriptParser } from './TypeScriptParser';
import { JavaScriptParser } from './JavaScriptParser';

export class ParserFactory {
	private parsers: Map<string, IParserStrategy> = new Map();

	constructor() {
		this.register(new TypeScriptParser());
		this.register(new JavaScriptParser());
	}

	private register(parser: IParserStrategy): void {
		for (const ext of parser.supportedExtensions) {
			this.parsers.set(ext, parser);
		}
	}

	getParser(filePath: string): IParserStrategy | undefined {
		const ext = path.extname(filePath).toLowerCase();
		return this.parsers.get(ext);
	}

	getSupportedExtensions(): string[] {
		return Array.from(this.parsers.keys());
	}
}
