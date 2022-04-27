import ts, { factory } from "typescript";
import { TransformState, TransformerConfig } from "./transformer";

export default function (program: ts.Program, config: TransformerConfig) {
	return (
		transformationstate: ts.TransformationContext
	): ((file: ts.SourceFile) => ts.Node) => {
		const state = new TransformState(program, transformationstate, config);

		return (file) => {
			state.pending.set(file, []);
			const transformed = state.transform(file);
			const pending = state.pending.get(file);
			let newFile = state.factory.cloneNode(transformed);
			pending?.forEach((fn, index, array) => {
				newFile = fn(state, newFile);
				pending.shift();
			});
			return newFile;
		};
	};
}
