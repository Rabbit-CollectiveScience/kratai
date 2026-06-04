import { ClassInfo } from '../../types/diagram';
import { Position } from './layoutCalculator';

export class ClassBoxRenderer {
	constructor(private boxWidth: number) {}

	render(classInfo: ClassInfo, pos: Position): string {
		const className = classInfo.name;
		const isModule = className.startsWith('[');
		const borderColor = isModule ? '#a78bfa' : 
							classInfo.isInterface ? '#4ecdc4' : 
							classInfo.isAbstract ? '#ff6b6b' : '#667eea';
		const borderStyle = isModule ? 'solid' : classInfo.isInterface ? 'dashed' : 'solid';
		const displayName = isModule ? className.slice(1, -1) : className;

		return `
			<div class="uml-box" data-class="${className}" style="
				position: absolute;
				left: ${pos.x}px;
				top: ${pos.y}px;
				width: ${this.boxWidth}px;
				background: white;
				border: 4px ${borderStyle} ${borderColor};
				border-radius: 8px;
				box-shadow: 0 4px 12px rgba(0,0,0,0.25);
				font-family: 'Courier New', monospace;
				font-size: 0.75em;
				z-index: 100;
				pointer-events: auto;
				box-sizing: border-box;
			">
				${this.renderHeader(classInfo, isModule, displayName, borderColor)}
				${this.renderProperties(classInfo, isModule, borderColor)}
				${this.renderMethods(classInfo, isModule)}
			</div>
		`;
	}

	private renderHeader(classInfo: ClassInfo, isModule: boolean, displayName: string, borderColor: string): string {
		const label = isModule ? '«module»<br>' : 
					  classInfo.isInterface ? '«interface»<br>' : 
					  classInfo.isAbstract ? '«abstract»<br>' : '';
		
		return `
			<div style="
				background: ${borderColor};
				color: white;
				padding: 8px;
				text-align: center;
				font-weight: bold;
				font-size: 0.9em;
				border-radius: 4px 4px 0 0;
			">
				${label}${displayName}
			</div>
		`;
	}

	private renderProperties(classInfo: ClassInfo, isModule: boolean, borderColor: string): string {
		const label = isModule ? 'No exports' : 'No properties';
		const items = classInfo.properties.slice(0, 4).map(prop => `
			<div style="padding: 1px 3px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${prop.name}: ${prop.type}">
				<span style="color: ${this.getVisibilityColor(prop.visibility)};">
					${this.getVisibilitySymbol(prop.visibility)}
				</span>
				${prop.name}
			</div>
		`).join('');

		const overflow = classInfo.properties.length > 4 ? 
			`<div style="color: #999; font-style: italic; padding: 1px 3px;">+${classInfo.properties.length - 4}</div>` : '';

		return `
			<div style="
				padding: 6px;
				border-bottom: 1px solid ${borderColor};
				min-height: 25px;
				max-height: 65px;
				overflow: hidden;
				background: #fafafa;
				font-size: 0.78em;
			">
				${items || `<div style="color: #999; font-style: italic; padding: 3px;">${label}</div>`}
				${overflow}
			</div>
		`;
	}

	private renderMethods(classInfo: ClassInfo, isModule: boolean): string {
		const label = isModule ? 'No functions' : 'No methods';
		const items = classInfo.methods.slice(0, 4).map(method => `
			<div style="padding: 1px 3px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" 
				 title="${method.name}(${method.parameters.map(p => p.name).join(', ')})">
				<span style="color: ${this.getVisibilityColor(method.visibility)};">
					${this.getVisibilitySymbol(method.visibility)}
				</span>
				${method.name}()
			</div>
		`).join('');

		const overflow = classInfo.methods.length > 4 ? 
			`<div style="color: #999; font-style: italic; padding: 1px 3px;">+${classInfo.methods.length - 4}</div>` : '';

		return `
			<div style="
				padding: 6px;
				min-height: 25px;
				max-height: 65px;
				overflow: hidden;
				font-size: 0.78em;
			">
				${items || `<div style="color: #999; font-style: italic; padding: 3px;">${label}</div>`}
				${overflow}
			</div>
		`;
	}

	private getVisibilityColor(visibility: 'public' | 'private' | 'protected'): string {
		return visibility === 'private' ? '#e74c3c' : 
			   visibility === 'protected' ? '#f39c12' : '#27ae60';
	}

	private getVisibilitySymbol(visibility: 'public' | 'private' | 'protected'): string {
		return visibility === 'private' ? '-' : 
			   visibility === 'protected' ? '#' : '+';
	}
}
