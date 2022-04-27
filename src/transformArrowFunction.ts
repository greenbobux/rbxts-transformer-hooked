import ts, {
	ContextFlags,
	isArrowFunction,
	startEndContainsRange,
	unusedLabelIsError,
} from "typescript";
import { TransformState } from "./transformer";
function evaluateParenthesis(node: ts.Node): ts.Node {
	if (ts.isParenthesizedExpression(node)) {
		return evaluateParenthesis(node.expression);
	} else {
		return node;
	}
}
export default function transformArrowFunction(
	state: TransformState,
	node: ts.ArrowFunction
) {
	const { factory } = state;
	const body = node.body;
	const file = node.getSourceFile();
	if (body) {
		if (ts.isBlock(body)) {
			const statements = body.statements.map((v) => v);
			let arrowFunction: ts.Node = node;

			statements.forEach((statement) => {
				if (ts.isReturnStatement(statement)) {
					const returned = statement.expression;

					if (returned)
						if (
							ts.isJsxOpeningLikeElement(
								evaluateParenthesis(returned)
							)
						) {
							if (!state.imported.get(file)) {
								state.pending
									.get(file)
									?.push((_state, file) => {
										if (ts.isSourceFile(file)) {
											const updated: ts.Statement[] = [];
											file.statements.forEach(
												(statement) => {
													if (
														!ts.isImportDeclaration(
															statement!
														)
													)
														return;
													const [clause, path] = [
														statement.importClause,
														statement.moduleSpecifier,
													];
													if (!clause) return;
													if (
														!ts.isStringLiteral(
															path
														)
													)
														return;

													if (
														path.text ===
														"@rbxts/roact-hooked"
													) {
														const namedImports =
															clause.namedBindings;
														if (namedImports)
															if (
																ts.isNamedImports(
																	namedImports
																)
															) {
																const file =
																	node.getSourceFile();
																let Imported: ts.ImportSpecifier =
																	factory.createImportSpecifier(
																		false,
																		undefined,
																		factory.createIdentifier(
																			"hooked"
																		)
																	);
																if (
																	namedImports.elements.filter(
																		(
																			imported,
																			i
																		) => {
																			Imported =
																				imported;

																			return (
																				imported
																					.name
																					.text ===
																				"hooked"
																			);
																		}
																	).length ===
																	0
																) {
																	updated.push(
																		factory.createImportDeclaration(
																			undefined,
																			undefined,
																			factory.createImportClause(
																				false,
																				undefined,
																				factory.createNamedImports(
																					[
																						factory.createImportSpecifier(
																							false,
																							undefined,
																							factory.createIdentifier(
																								"hooked"
																							)
																						),
																					]
																				)
																			),
																			factory.createStringLiteral(
																				"@rbxts/roact-hooked"
																			),
																			undefined
																		)
																	);
																}
															}
													}
												}
											);

											return factory.updateSourceFile(
												file,
												[...updated, ...file.statements]
											);
										}
										return file;
									});
								state.imported.set(file, true);
							}
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
