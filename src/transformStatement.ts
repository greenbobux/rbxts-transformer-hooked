import ts from "typescript";
import { TransformState } from "./transformer";

export function transformStatement(state: TransformState, node: ts.Statement) {
	return state.transform(node);
}
