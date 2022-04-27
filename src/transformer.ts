import ts, { factory, fileExtensionIs, TsConfigOnlyOption } from "typescript";
import { transformNode } from "./transformNode";

/**
 * This is the transformer's configuration, the values are passed from the tsconfig.
 */
export interface TransformerConfig {
	_: void;
}

/**
 * This is a utility object to pass around your dependencies.
 *
 * You can also use this object to store state, e.g prereqs.
 */
export class TransformState {
	public factory: ts.NodeFactory;
	public typeChecker: ts.TypeChecker;
	public imported = new Map<ts.SourceFile, boolean>();
	public pending = new Map<
		ts.SourceFile,
		((state: TransformState, node: ts.SourceFile) => ts.SourceFile)[]
	>();
	constructor(
		public program: ts.Program,
		public state: ts.TransformationContext,
		public config: TransformerConfig
	) {
		this.factory = state.factory;
		this.typeChecker = program.getTypeChecker();
	}

	/**
	 * Transforms the children of the specified node.
	 */
	transform<T extends ts.Node>(node: T): T {
		return ts.visitEachChild(
			node,
			(node) => transformNode(this, node),
			this.state
		);
	}
}
