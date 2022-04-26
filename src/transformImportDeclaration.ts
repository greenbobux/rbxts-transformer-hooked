import ts, {
	classOrConstructorParameterIsDecorated,
	createLanguageService,
} from "typescript";
import { TransformState } from "./transformer";
import {} from "ts-expose-internals";
export function transformImportDeclaration(
	state: TransformState,
	node: ts.ImportDeclaration
) {
	const { factory } = state;
	const [clause, path] = [node.importClause, node.moduleSpecifier];
	if (!clause) return state.transform(node);
	if (!ts.isStringLiteral(path)) return state.transform(node);

	if (path.text === "@rbxts/roact-hooked") {
		const namedImports = clause.namedBindings;
		if (namedImports)
			if (ts.isNamedImports(namedImports)) {
				const file = node.getSourceFile();

				if (
					namedImports.elements.filter((imported) => {
						return imported.name.text === "hooked";
					}).length === 0
				) {
					return factory.updateImportDeclaration(
						node,
						undefined,
						undefined,
						factory.updateImportClause(
							clause,
							false,
							undefined,
							factory.createNamedImports([
								factory.createImportSpecifier(
									false,
									undefined,
									factory.createIdentifier("hooked")
								),
								...namedImports.elements,
							])
						),
						path,
						undefined
					);
				}
			}
	}
	return state.transform(node);
}
