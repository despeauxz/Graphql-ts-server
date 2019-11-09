export interface Context {}

export type Resolver = (
    parent: any,
    args: any,
    context: Context,
    info: any
) => any;

export interface ResolversMap {
    [key: string]: {
        [key: string]: Resolver
    };
}