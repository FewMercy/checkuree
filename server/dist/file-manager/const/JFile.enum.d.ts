declare const JFileEnum_base: import("ts-jenum").IStaticEnum<JFileEnum>;
export declare class JFileEnum extends JFileEnum_base {
    readonly code: string;
    readonly path: string;
    static readonly IMAGE: JFileEnum;
    static readonly VIDEO: JFileEnum;
    static readonly ETC: JFileEnum;
    private constructor();
}
export {};
