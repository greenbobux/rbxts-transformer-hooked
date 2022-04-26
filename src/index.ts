import ts from "typescript";
import { TransformState, TransformerConfig } from "./transformer";

export default function (program: ts.Program, config: TransformerConfig) {
	return (
		transformationstate: ts.TransformationContext
	): ((file: ts.SourceFile) => ts.Node) => {
		const state = new TransformState(program, transformationstate, config);

		return (file) => state.transform(file);
	};
}
