// tslint:disable
// graphql typescript definitions

declare namespace GQL {
    interface IGraphQLResponseRoot {
        data?: IQuery | IMutation;
        errors?: Array<IGraphQLResponseError>;
    }

    interface IGraphQLResponseError {
        /** Required for all errors */
        message: string;
        locations?: Array<IGraphQLResponseErrorLocation>;
        /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
        [propName: string]: any;
    }

    interface IGraphQLResponseErrorLocation {
        line: number;
        column: number;
    }

    interface IQuery {
        __typename: "Query";
        bye: string;
        hello: string;
    }

    interface IByeOnQueryArguments {
        name?: string | null;
    }

    interface IHelloOnQueryArguments {
        name?: string | null;
    }

    interface IMutation {
        __typename: "Mutation";
        login: Array<IError> | null;
        register: Array<IError> | null;
    }

    interface ILoginOnMutationArguments {
        email: string;
        password: string;
    }

    interface IRegisterOnMutationArguments {
        email: string;
        password: string;
    }

    interface IError {
        __typename: "Error";
        path: string;
        message: string;
    }

    interface IUser {
        __typename: "User";
        id: string;
        email: string;
    }
}

// tslint:enable
