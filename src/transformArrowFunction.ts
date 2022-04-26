import ts from "typescript";
import { TransformState } from "./transformer";
export default function transformArrowFunction(
	state: TransformState,
	node: ts.ArrowFunction
) {
	const { factory } = state;
	const body = node.body;
	if (body) {
		if (ts.isBlock(body)) {
			const statements = body.statements.map((v) => v);
			let arrowFunction: ts.Node = node;
			statements.forEach((statement) => {
				if (ts.isReturnStatement(statement)) {
					const returned = statement.expression;
					if (returned)
						if (ts.isJsxOpeningLikeElement(returned)) {
							arrowFunction = factory.createCallExpression(
								factory.createIdentifier("hooked"),
								[],
								[node]
							);
						}
				}
			});
			return arrowFunction;
		}
	}
	return state.transform(node);
}
