import ts from "typescript";
import { TransformState } from "./transformer";
import { transformImportDeclaration } from "./transformImportDeclaration";

export function transformStatement(state: TransformState, node: ts.Statement) {
	if (ts.isImportDeclaration(node)) {
		return transformImportDeclaration(state, node);
	}
	return state.transform(node);
}
