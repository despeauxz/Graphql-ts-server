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
        dummy2: string | null;
        bye: string;
        dummy: string | null;
        me: IUser | null;
        hello: string;
    }

    interface IByeOnQueryArguments {
        name?: string | null;
    }

    interface IHelloOnQueryArguments {
        name?: string | null;
    }

    interface IUser {
        __typename: "User";
        id: string;
        email: string;
    }

    interface IMutation {
        __typename: "Mutation";
        sendForgotPasswordMail: boolean | null;
        forgotPasswordChange: boolean | null;
        login: Array<IError> | null;
        logout: boolean | null;
        register: Array<IError> | null;
    }

    interface ISendForgotPasswordMailOnMutationArguments {
        email: string;
    }

    interface IForgotPasswordChangeOnMutationArguments {
        newPassword: string;
        key: string;
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
}

// tslint:enable
