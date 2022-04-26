import ts from "typescript";
import transformArrowFunction from "./transformArrowFunction";
import { TransformState } from "./transformer";

export function transformExpression(
	state: TransformState,
	node: ts.Expression
) {
	if (ts.isArrowFunction(node)) {
		return transformArrowFunction(state, node);
	}
	return state.transform(node);
}
