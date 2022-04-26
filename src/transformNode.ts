import ts from "typescript";
import transformArrowFunction from "./transformArrowFunction";
import { TransformState } from "./transformer";
import { transformExpression } from "./transformExpression";
import { transformStatement } from "./transformStatement";
export function transformNode(state: TransformState, node: ts.Node): ts.Node {
	if (ts.isStatement(node)) {
		return transformStatement(state, node);
	} else if (ts.isExpression(node)) {
		return transformExpression(state, node);
	}
	return state.transform(node);
}
