import { GraphQLClient } from 'graphql-request'
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types'
import gql from 'graphql-tag'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
    T extends { [key: string]: unknown },
    K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
    | T
    | {
          [P in keyof T]?: P extends ' $fragmentName' | '__typename'
              ? T[P]
              : never
      }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string }
    String: { input: string; output: string }
    Boolean: { input: boolean; output: boolean }
    Int: { input: number; output: number }
    Float: { input: number; output: number }
    DateTime: { input: any; output: any }
    FieldSet: { input: any; output: any }
    UUID: { input: any; output: any }
    _Any: { input: any; output: any }
    link__Import: { input: any; output: any }
}

/** Input to create a CategoricalCategoryCharacteristic for a Category */
export type CategoricalCategoryCharacteristicInput = {
    /** The description of the CategoricalCategoryCharacteristic */
    description: Scalars['String']['input']
    /** The name of the CategoricalCategoryCharacteristic */
    name: Scalars['String']['input']
}

/** Input for creating a CategoricalCategoryCharacteristicValue. */
export type CategoricalCategoryCharacteristicValueInput = {
    /** The id of the CategoryCharacteristic. */
    characteristicId: Scalars['UUID']['input']
    /** The value of the CategoricalCategoryCharacteristicValue. */
    value: Scalars['String']['input']
}

/** CategoryCharacteristic order fields */
export enum CategoryCharacteristicOrderField {
    /** Order categoryCharacteristics by their id */
    Id = 'ID',
}

/** CategoryCharacteristic order */
export type CategoryCharacteristicOrderInput = {
    /** The direction to order by */
    direction: OrderDirection
    /** The field to order by */
    field: CategoryCharacteristicOrderField
}

/** CategoryCharacteristicValue order fields */
export enum CategoryCharacteristicValueOrderField {
    /** Order categoryCharacteristicValues by their id */
    Id = 'ID',
}

/** CategoryCharacteristicValue order */
export type CategoryCharacteristicValueOrderInput = {
    /** The direction to order by */
    direction: OrderDirection
    /** The field to order by */
    field: CategoryCharacteristicValueOrderField
}

/** Category order fields */
export enum CategoryOrderField {
    /** Order categories by their id */
    Id = 'ID',
}

/** Category order */
export type CategoryOrderInput = {
    /** The direction to order by */
    direction: OrderDirection
    /** The field to order by */
    field: CategoryOrderField
}

/** Input for the createCategoricalCategoryCharacteristic mutation */
export type CreateCategoricalCategoryCharacteristicInput = {
    /** The Category that the CategoricalCategoryCharacteristicI belongs to */
    categoryId: Scalars['UUID']['input']
    /** The description of the CategoricalCategoryCharacteristic */
    description: Scalars['String']['input']
    /** The name of the CategoricalCategoryCharacteristic */
    name: Scalars['String']['input']
}

/** Input for the createCategory mutation */
export type CreateCategoryInput = {
    /** The CategoricalCategoryCharacteristics of the Category */
    categoricalCharacteristics: Array<CategoricalCategoryCharacteristicInput>
    /** The description of the Category */
    description: Scalars['String']['input']
    /** The name of the Category */
    name: Scalars['String']['input']
    /** The NumericalCategoryCharacteristics of the Category */
    numericalCharacteristics: Array<NumericalCategoryCharacteristicInput>
}

/** Input for the createNumericalCategoryCharacteristic mutation */
export type CreateNumericalCategoryCharacteristicInput = {
    /** The Category that the NumericalCategoryCharacteristic belongs to */
    categoryId: Scalars['UUID']['input']
    /** The description of the NumericalCategoryCharacteristic */
    description: Scalars['String']['input']
    /** The name of the NumericalCategoryCharacteristic */
    name: Scalars['String']['input']
    /** The unit of the NumericalCategoryCharacteristic */
    unit: Scalars['String']['input']
}

/** Input for the createProduct mutation */
export type CreateProductInput = {
    /** The Categories this product is associated with. */
    categoryIds: Array<Scalars['UUID']['input']>
    /** The default ProductVariant of the Product. */
    defaultVariant: ProductVariantInput
    /** An internal name to identify the Product, not visible to customers. */
    internalName: Scalars['String']['input']
    /** If true, the Product is visible to customers. */
    isPubliclyVisible: Scalars['Boolean']['input']
}

/** Input for the createProductVariant mutation */
export type CreateProductVariantInput = {
    /** The initial ProductVariantVersion of the ProductVariant. */
    initialVersion: ProductVariantVersionInput
    /** If true, the ProductVariant is visible to customers. */
    isPubliclyVisible: Scalars['Boolean']['input']
    /** The id of the Product this ProductVariant belongs to. */
    productId: Scalars['UUID']['input']
}

/** Input for the createProductVariantVersion mutation */
export type CreateProductVariantVersionInput = {
    /** The amount of days for which an instance of the ProductVariant can be returned after purchase */
    canBeReturnedForDays?: InputMaybe<Scalars['Float']['input']>
    /** The CategoricalCategoryCharacteristicValues of the ProductVariant, must be compatible with the Categories of the associated Product. */
    categoricalCharacteristicValues: Array<CategoricalCategoryCharacteristicValueInput>
    /** The description of the ProductVariant. */
    description: Scalars['String']['input']
    /** The name of the ProductVariant. */
    name: Scalars['String']['input']
    /** The NumericalCategoryCharacteristicValues of the ProductVariant, must be compatible with the Categories of the associated Product. */
    numericalCharacteristicValues: Array<NumericalCategoryCharacteristicValueInput>
    /** The id of the ProductVariant this ProductVariantVersion belongs to. */
    productVariantId: Scalars['UUID']['input']
    /** The retail price of the ProductVariant. */
    retailPrice: Scalars['Int']['input']
}

/** Input to create a characteristic whose values have arithmetic meaning, i.e. '8GB' */
export type NumericalCategoryCharacteristicInput = {
    /** The description of the NumericalCategoryCharacteristic */
    description: Scalars['String']['input']
    /** The name of the NumericalCategoryCharacteristic */
    name: Scalars['String']['input']
    /** The unit of the NumericalCategoryCharacteristic */
    unit: Scalars['String']['input']
}

/** Input for creating a NumericalCategoryCharacteristicValue. */
export type NumericalCategoryCharacteristicValueInput = {
    /** The id of the CategoryCharacteristic. */
    characteristicId: Scalars['UUID']['input']
    /** The value of the NumericalCategoryCharacteristicValue. */
    value: Scalars['Float']['input']
}

/** Order direction */
export enum OrderDirection {
    /** Ascending order */
    Asc = 'ASC',
    /** Descending order */
    Desc = 'DESC',
}

/** Product order fields */
export enum ProductOrderField {
    /** Order products by their id */
    Id = 'ID',
}

/** Product order */
export type ProductOrderInput = {
    /** The direction to order by */
    direction: OrderDirection
    /** The field to order by */
    field: ProductOrderField
}

/** Input for creating a product variant */
export type ProductVariantInput = {
    /** The initial ProductVariantVersion of the ProductVariant. */
    initialVersion: ProductVariantVersionInput
    /** If true, the ProductVariant is visible to customers. */
    isPubliclyVisible: Scalars['Boolean']['input']
}

/** ProductVariant order fields */
export enum ProductVariantOrderField {
    /** Order productVariants by their id */
    Id = 'ID',
}

/** ProductVariant order */
export type ProductVariantOrderInput = {
    /** The direction to order by */
    direction: OrderDirection
    /** The field to order by */
    field: ProductVariantOrderField
}

/** Input for creating a ProductVariantVersion. */
export type ProductVariantVersionInput = {
    /** The amount of days for which an instance of the ProductVariant can be returned after purchase */
    canBeReturnedForDays?: InputMaybe<Scalars['Float']['input']>
    /** The CategoricalCategoryCharacteristicValues of the ProductVariant, must be compatible with the Categories of the associated Product. */
    categoricalCharacteristicValues: Array<CategoricalCategoryCharacteristicValueInput>
    /** The description of the ProductVariant. */
    description: Scalars['String']['input']
    /** The name of the ProductVariant. */
    name: Scalars['String']['input']
    /** The NumericalCategoryCharacteristicValues of the ProductVariant, must be compatible with the Categories of the associated Product. */
    numericalCharacteristicValues: Array<NumericalCategoryCharacteristicValueInput>
    /** The retail price of the ProductVariant. */
    retailPrice: Scalars['Int']['input']
}

/** ProductVariantVersion order fields */
export enum ProductVariantVersionOrderField {
    /** Order productVariantVersions by their id */
    Id = 'ID',
}

/** ProductVariantVersion order */
export type ProductVariantVersionOrderInput = {
    /** The direction to order by */
    direction: OrderDirection
    /** The field to order by */
    field: ProductVariantVersionOrderField
}

export type GetProductsListQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']['input']>
    skip?: InputMaybe<Scalars['Int']['input']>
}>

export type GetProductsListQuery = {
    __typename?: 'Query'
    products: {
        __typename?: 'ProductConnection'
        totalCount: number
        nodes: Array<{
            __typename?: 'Product'
            id: any
            defaultVariant: {
                __typename?: 'ProductVariant'
                id: any
                currentVersion: {
                    __typename?: 'ProductVariantVersion'
                    name: string
                    retailPrice: number
                }
            }
        }>
    }
}

export type GetProductQueryVariables = Exact<{
    id: Scalars['UUID']['input']
}>

export type GetProductQuery = {
    __typename?: 'Query'
    product: {
        __typename?: 'Product'
        id: any
        internalName: string
        isPubliclyVisible: boolean
        defaultVariant: {
            __typename?: 'ProductVariant'
            id: any
            isPubliclyVisible: boolean
            currentVersion: {
                __typename?: 'ProductVariantVersion'
                id: any
                name: string
                description: string
                retailPrice: number
            }
        }
        variants: {
            __typename?: 'ProductVariantConnection'
            nodes: Array<{
                __typename?: 'ProductVariant'
                id: any
                isPubliclyVisible: boolean
                currentVersion: {
                    __typename?: 'ProductVariantVersion'
                    id: any
                    name: string
                    description: string
                    retailPrice: number
                }
            }>
        }
    }
}

export type CreateProductMutationVariables = Exact<{
    input: CreateProductInput
}>

export type CreateProductMutation = {
    __typename?: 'Mutation'
    createProduct: { __typename?: 'Product'; id: any }
}

export type CreateProductVariantMutationVariables = Exact<{
    input: CreateProductVariantInput
}>

export type CreateProductVariantMutation = {
    __typename?: 'Mutation'
    createProductVariant: { __typename?: 'ProductVariant'; id: any }
}

export const GetProductsListDocument = gql`
    query getProductsList($first: Int, $skip: Int) {
        products(first: $first, skip: $skip) {
            nodes {
                id
                defaultVariant {
                    id
                    currentVersion {
                        name
                        retailPrice
                    }
                }
            }
            totalCount
        }
    }
`
export const GetProductDocument = gql`
    query getProduct($id: UUID!) {
        product(id: $id) {
            id
            internalName
            isPubliclyVisible
            defaultVariant {
                id
                isPubliclyVisible
                currentVersion {
                    id
                    name
                    description
                    retailPrice
                }
            }
            variants {
                nodes {
                    id
                    isPubliclyVisible
                    currentVersion {
                        id
                        name
                        description
                        retailPrice
                    }
                }
            }
        }
    }
`
export const CreateProductDocument = gql`
    mutation createProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
            id
        }
    }
`
export const CreateProductVariantDocument = gql`
    mutation createProductVariant($input: CreateProductVariantInput!) {
        createProductVariant(input: $input) {
            id
        }
    }
`

export type SdkFunctionWrapper = <T>(
    action: (requestHeaders?: Record<string, string>) => Promise<T>,
    operationName: string,
    operationType?: string,
    variables?: any
) => Promise<T>

const defaultWrapper: SdkFunctionWrapper = (
    action,
    _operationName,
    _operationType,
    variables
) => action()

export function getSdk(
    client: GraphQLClient,
    withWrapper: SdkFunctionWrapper = defaultWrapper
) {
    return {
        getProductsList(
            variables?: GetProductsListQueryVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<GetProductsListQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<GetProductsListQuery>(
                        GetProductsListDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'getProductsList',
                'query',
                variables
            )
        },
        getProduct(
            variables: GetProductQueryVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<GetProductQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<GetProductQuery>(
                        GetProductDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'getProduct',
                'query',
                variables
            )
        },
        createProduct(
            variables: CreateProductMutationVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<CreateProductMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<CreateProductMutation>(
                        CreateProductDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'createProduct',
                'mutation',
                variables
            )
        },
        createProductVariant(
            variables: CreateProductVariantMutationVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<CreateProductVariantMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<CreateProductVariantMutation>(
                        CreateProductVariantDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'createProductVariant',
                'mutation',
                variables
            )
        },
    }
}
export type Sdk = ReturnType<typeof getSdk>
