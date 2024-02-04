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
    Date: { input: any; output: any }
    DateTime: { input: any; output: any }
    UUID: { input: any; output: any }
}

export type AddShoppingCartItemInput = {
    /** UUID of user owning the shopping cart. */
    id: Scalars['UUID']['input']
    /** ShoppingCartItem in shoppingcart to update */
    shoppingCartItem: ShoppingCartItemInput
}

export type AddWishlistInput = {
    /** Wishlist name. */
    name: Scalars['String']['input']
    /** UUIDs of product variants in wishlist. */
    productVariantIds: Array<Scalars['UUID']['input']>
    /** UUID of user owning the wishlist. */
    userId: Scalars['UUID']['input']
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

/** CategoricalCategoryCharacteristicValue order fields */
export enum CategoricalCategoryCharacteristicValueOrderField {
    /** Order CategoricalCategoryCharacteristicValue by their id */
    Value = 'VALUE',
}

/** CategoricalCategoryCharacteristicValue order */
export type CategoricalCategoryCharacteristicValueOrderInput = {
    /** The direction to order by */
    direction?: InputMaybe<OrderDirection>
    /** The field to order by */
    field?: InputMaybe<CategoricalCategoryCharacteristicValueOrderField>
}

/** CategoryCharacteristic order fields */
export enum CategoryCharacteristicOrderField {
    /** Order categoryCharacteristics by their id */
    Id = 'ID',
}

/** CategoryCharacteristic order */
export type CategoryCharacteristicOrderInput = {
    /** The direction to order by */
    direction?: InputMaybe<OrderDirection>
    /** The field to order by */
    field?: InputMaybe<CategoryCharacteristicOrderField>
}

/** CategoryCharacteristicValue order fields */
export enum CategoryCharacteristicValueOrderField {
    /** Order categoryCharacteristicValues by their id */
    Id = 'ID',
}

/** CategoryCharacteristicValue order */
export type CategoryCharacteristicValueOrderInput = {
    /** The direction to order by */
    direction?: InputMaybe<OrderDirection>
    /** The field to order by */
    field?: InputMaybe<CategoryCharacteristicValueOrderField>
}

/** Category order fields */
export enum CategoryOrderField {
    /** Order categories by their id */
    Id = 'ID',
    /** Order categories by their name */
    Name = 'NAME',
}

/** Category order */
export type CategoryOrderInput = {
    /** The direction to order by */
    direction?: InputMaybe<OrderDirection>
    /** The field to order by */
    field?: InputMaybe<CategoryOrderField>
}

/**
 * Describes the fields that a foreign types can be ordered by.
 *
 * Only the Id valid at the moment.
 */
export enum CommonOrderField {
    /** Orders by "id". */
    Id = 'ID',
}

/** Specifies the order of foreign types. */
export type CommonOrderInput = {
    /** Order direction of shoppingcarts. */
    direction?: InputMaybe<OrderDirection>
    /** Field that shoppingcarts should be ordered by. */
    field?: InputMaybe<CommonOrderField>
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

/** Input for the createNotification mutation */
export type CreateNotificationInput = {
    /** body of the notification to create */
    body: Scalars['String']['input']
    /** title of the notification to create */
    title: Scalars['String']['input']
    /** id of the user the notification should be sent to */
    userId: Scalars['UUID']['input']
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

/** The input of a product item batch creation */
export type CreateProductItemBatchInput = {
    /** The number of products to add */
    number: Scalars['Float']['input']
    /** The product variant id of the product item */
    productVariantId: Scalars['UUID']['input']
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

export type CreateUserDtoInput = {
    name: Scalars['String']['input']
    username: Scalars['String']['input']
}

/** The gender of a user */
export enum Gender {
    /** Diverse gender */
    Diverse = 'DIVERSE',
    /** Female gender */
    Female = 'FEMALE',
    /** Male gender */
    Male = 'MALE',
    /** Other gender */
    Other = 'OTHER',
}

/** Notification order fields */
export enum NotificationOrderField {
    /** Order notifications by their id */
    Id = 'ID',
}

/** Notification order */
export type NotificationOrderInput = {
    /** The direction to order by */
    direction?: InputMaybe<OrderDirection>
    /** The field to order by */
    field?: InputMaybe<NotificationOrderField>
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

/** Ordering options for product items */
export type ProductItemOrder = {
    /** The direction to order by */
    direction?: InputMaybe<OrderDirection>
    /** The field to order by */
    field?: InputMaybe<ProductItemOrderField>
}

/** The field to order Product Items by */
export enum ProductItemOrderField {
    /** Order Product Items by their ID */
    Id = 'ID',
}

/** Product order fields */
export enum ProductOrderField {
    /** Order products by their id */
    Id = 'ID',
    /** Order products by their internal name */
    InternalName = 'INTERNAL_NAME',
}

/** Product order */
export type ProductOrderInput = {
    /** The direction to order by */
    direction?: InputMaybe<OrderDirection>
    /** The field to order by */
    field?: InputMaybe<ProductOrderField>
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
    direction?: InputMaybe<OrderDirection>
    /** The field to order by */
    field?: InputMaybe<ProductVariantOrderField>
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
    /** Order productVariantVersions by their creation date */
    CreatedAt = 'CREATED_AT',
    /** Order productVariantVersions by their id */
    Id = 'ID',
    /** Order productVariantVersions by their version */
    Version = 'VERSION',
}

/** ProductVariantVersion order */
export type ProductVariantVersionOrderInput = {
    /** The direction to order by */
    direction?: InputMaybe<OrderDirection>
    /** The field to order by */
    field?: InputMaybe<ProductVariantVersionOrderField>
}

export type ShoppingCartItemInput = {
    /** Count of items in basket. */
    count: Scalars['Int']['input']
    /** Uuid of product variant. */
    productVariantId: Scalars['UUID']['input']
}

/** Input for the updateNotification mutation */
export type UpdateNotificationInput = {
    /** id of the notification to update */
    id: Scalars['UUID']['input']
    /** mark the notification as read/unread */
    isRead: Scalars['Boolean']['input']
}

/** The input of a product item update */
export type UpdateProductItemInput = {
    /** The product item identifier */
    id: Scalars['UUID']['input']
    /** The inventory state of the product item */
    isInInventory: Scalars['Boolean']['input']
    /** The product variant id of the product item */
    productVariantId: Scalars['UUID']['input']
}

export type UpdateShoppingCartInput = {
    /** UUID of user owning shopping cart. */
    id: Scalars['UUID']['input']
    /** ShoppingCartItems of shoppingcart to update */
    shoppingCartItems?: InputMaybe<Array<ShoppingCartItemInput>>
}

export type UpdateShoppingCartItemInput = {
    /** Count of items in basket. */
    count: Scalars['Int']['input']
    /** UUID of shoppingcart item to update. */
    id: Scalars['UUID']['input']
}

export type UpdateWishlistInput = {
    /** UUID of wishlist to update. */
    id: Scalars['UUID']['input']
    /** Wishlist name to update */
    name?: InputMaybe<Scalars['String']['input']>
    /** product variant UUIDs of wishlist to update */
    productVariantIds?: InputMaybe<Array<Scalars['UUID']['input']>>
}

/** Describes the fields that a wishlist can be ordered by. */
export enum WishlistOrderField {
    /** Orders by "created_at". */
    CreatedAt = 'CREATED_AT',
    /** Orders by "id". */
    Id = 'ID',
    /** Orders by "last_updated_at". */
    LastUpdatedAt = 'LAST_UPDATED_AT',
    /** Orders by "name". */
    Name = 'NAME',
    /** Orders by "user_id". */
    UserId = 'USER_ID',
}

/** Specifies the order of wishlists. */
export type WishlistOrderInput = {
    /** Order direction of wishlists. */
    direction?: InputMaybe<OrderDirection>
    /** Field that wishlists should be ordered by. */
    field?: InputMaybe<WishlistOrderField>
}

export type DefaultProductVariantFragment = {
    __typename?: 'Product'
    id: any
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
            canBeReturnedForDays?: number | null
            version: number
            createdAt: any
        }
    }
    variants: { __typename?: 'ProductVariantConnection'; totalCount: number }
}

export type CurrentVersionFragment = {
    __typename?: 'ProductVariantVersion'
    id: any
    name: string
    description: string
    retailPrice: number
    canBeReturnedForDays?: number | null
    version: number
    createdAt: any
}

type Characteristic_CategoricalCategoryCharacteristic_Fragment = {
    __typename: 'CategoricalCategoryCharacteristic'
    id: any
    name: string
    values: {
        __typename?: 'CategoricalCategoryCharacteristicValueConnection'
        totalCount: number
        nodes: Array<{
            __typename?: 'CategoricalCategoryCharacteristicValue'
            value: string
        }>
    }
}

type Characteristic_NumericalCategoryCharacteristic_Fragment = {
    __typename: 'NumericalCategoryCharacteristic'
    unit: string
    id: any
    name: string
}

export type CharacteristicFragment =
    | Characteristic_CategoricalCategoryCharacteristic_Fragment
    | Characteristic_NumericalCategoryCharacteristic_Fragment

export type GetDefaultProductVariantsQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']['input']>
    skip?: InputMaybe<Scalars['Int']['input']>
    orderBy?: InputMaybe<ProductOrderInput>
}>

export type GetDefaultProductVariantsQuery = {
    __typename?: 'Query'
    products: {
        __typename?: 'ProductConnection'
        totalCount: number
        hasNextPage: boolean
        nodes: Array<{
            __typename?: 'Product'
            id: any
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
                    canBeReturnedForDays?: number | null
                    version: number
                    createdAt: any
                }
            }
            variants: {
                __typename?: 'ProductVariantConnection'
                totalCount: number
            }
        }>
    }
}

export type GetCategoryWithCharacteristicsAndDefaultProductVariantsQueryVariables =
    Exact<{
        id: Scalars['UUID']['input']
        firstProducts?: InputMaybe<Scalars['Int']['input']>
        skipProducts?: InputMaybe<Scalars['Int']['input']>
        orderProductsBy?: InputMaybe<ProductOrderInput>
    }>

export type GetCategoryWithCharacteristicsAndDefaultProductVariantsQuery = {
    __typename?: 'Query'
    category: {
        __typename?: 'Category'
        id: any
        name: string
        description: string
        characteristics: {
            __typename?: 'CategoryCharacteristicConnection'
            totalCount: number
            nodes: Array<
                | {
                      __typename: 'CategoricalCategoryCharacteristic'
                      id: any
                      name: string
                      values: {
                          __typename?: 'CategoricalCategoryCharacteristicValueConnection'
                          totalCount: number
                          nodes: Array<{
                              __typename?: 'CategoricalCategoryCharacteristicValue'
                              value: string
                          }>
                      }
                  }
                | {
                      __typename: 'NumericalCategoryCharacteristic'
                      unit: string
                      id: any
                      name: string
                  }
            >
        }
        products: {
            __typename?: 'ProductConnection'
            totalCount: number
            hasNextPage: boolean
            nodes: Array<{
                __typename?: 'Product'
                id: any
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
                        canBeReturnedForDays?: number | null
                        version: number
                        createdAt: any
                    }
                }
                variants: {
                    __typename?: 'ProductVariantConnection'
                    totalCount: number
                }
            }>
        }
    }
}

export type GetCategoriesWithTotalCountOfProductsQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']['input']>
    skip?: InputMaybe<Scalars['Int']['input']>
    orderBy?: InputMaybe<CategoryOrderInput>
}>

export type GetCategoriesWithTotalCountOfProductsQuery = {
    __typename?: 'Query'
    categories: {
        __typename?: 'CategoryConnection'
        totalCount: number
        hasNextPage: boolean
        nodes: Array<{
            __typename?: 'Category'
            id: any
            name: string
            products: {
                __typename?: 'ProductConnection'
                totalCount: number
                nodes: Array<{
                    __typename?: 'Product'
                    isPubliclyVisible: boolean
                    variants: {
                        __typename?: 'ProductVariantConnection'
                        totalCount: number
                        nodes: Array<{
                            __typename?: 'ProductVariant'
                            isPubliclyVisible: boolean
                        }>
                    }
                }>
            }
        }>
    }
}

export type GetCategoriesWithCharacteristicsQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']['input']>
    skip?: InputMaybe<Scalars['Int']['input']>
    orderBy?: InputMaybe<CategoryOrderInput>
}>

export type GetCategoriesWithCharacteristicsQuery = {
    __typename?: 'Query'
    categories: {
        __typename?: 'CategoryConnection'
        totalCount: number
        hasNextPage: boolean
        nodes: Array<{
            __typename?: 'Category'
            id: any
            name: string
            characteristics: {
                __typename?: 'CategoryCharacteristicConnection'
                totalCount: number
                nodes: Array<
                    | {
                          __typename: 'CategoricalCategoryCharacteristic'
                          id: any
                          name: string
                          values: {
                              __typename?: 'CategoricalCategoryCharacteristicValueConnection'
                              totalCount: number
                              nodes: Array<{
                                  __typename?: 'CategoricalCategoryCharacteristicValue'
                                  value: string
                              }>
                          }
                      }
                    | {
                          __typename: 'NumericalCategoryCharacteristic'
                          unit: string
                          id: any
                          name: string
                      }
                >
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
        isPubliclyVisible: boolean
        internalName: string
        defaultVariant: { __typename?: 'ProductVariant'; id: any }
        variants: {
            __typename?: 'ProductVariantConnection'
            totalCount: number
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
                    canBeReturnedForDays?: number | null
                    version: number
                    createdAt: any
                    characteristicValues: {
                        __typename?: 'CategoryCharacteristicValueConnection'
                        totalCount: number
                        nodes: Array<
                            | {
                                  __typename: 'CategoricalCategoryCharacteristicValue'
                                  categoricalValue: string
                                  characteristic:
                                      | {
                                            __typename?: 'CategoricalCategoryCharacteristic'
                                            id: any
                                            name: string
                                            category: {
                                                __typename?: 'Category'
                                                id: any
                                            }
                                        }
                                      | {
                                            __typename?: 'NumericalCategoryCharacteristic'
                                            id: any
                                            name: string
                                            category: {
                                                __typename?: 'Category'
                                                id: any
                                            }
                                        }
                              }
                            | {
                                  __typename: 'NumericalCategoryCharacteristicValue'
                                  numericalValue: number
                                  characteristic:
                                      | {
                                            __typename?: 'CategoricalCategoryCharacteristic'
                                            id: any
                                            name: string
                                            category: {
                                                __typename?: 'Category'
                                                id: any
                                            }
                                        }
                                      | {
                                            __typename?: 'NumericalCategoryCharacteristic'
                                            id: any
                                            name: string
                                            category: {
                                                __typename?: 'Category'
                                                id: any
                                            }
                                        }
                              }
                        >
                    }
                }
            }>
        }
        categories: {
            __typename?: 'CategoryConnection'
            totalCount: number
            nodes: Array<{ __typename?: 'Category'; id: any; name: string }>
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

export type CreateNewProductVariantVersionMutationVariables = Exact<{
    input: CreateProductVariantVersionInput
}>

export type CreateNewProductVariantVersionMutation = {
    __typename?: 'Mutation'
    createProductVariantVersion: {
        __typename?: 'ProductVariantVersion'
        id: any
    }
}

export type CreateCategoryMutationVariables = Exact<{
    input: CreateCategoryInput
}>

export type CreateCategoryMutation = {
    __typename?: 'Mutation'
    createCategory: { __typename?: 'Category'; id: any }
}

export type CreateCategoricalCategoryCharacteristicMutationVariables = Exact<{
    input: CreateCategoricalCategoryCharacteristicInput
}>

export type CreateCategoricalCategoryCharacteristicMutation = {
    __typename?: 'Mutation'
    createCategoricalCategoryCharacteristic: {
        __typename?: 'CategoricalCategoryCharacteristic'
        id: any
    }
}

export type CreateNumericalCategoryCharacteristicMutationVariables = Exact<{
    input: CreateNumericalCategoryCharacteristicInput
}>

export type CreateNumericalCategoryCharacteristicMutation = {
    __typename?: 'Mutation'
    createNumericalCategoryCharacteristic: {
        __typename?: 'NumericalCategoryCharacteristic'
        id: any
    }
}

export type WishlistFragment = {
    __typename?: 'Wishlist'
    id: any
    name: string
    createdAt: any
    lastUpdatedAt: any
    productVariants: {
        __typename?: 'ProductVariantConnection'
        totalCount: number
    }
}

export type GetUserWithWishlistsQueryVariables = Exact<{
    userId: Scalars['UUID']['input']
    firstWishlists?: InputMaybe<Scalars['Int']['input']>
    skipWishlist?: InputMaybe<Scalars['Int']['input']>
    orderWishlistsBy?: InputMaybe<WishlistOrderInput>
}>

export type GetUserWithWishlistsQuery = {
    __typename?: 'Query'
    user: {
        __typename?: 'User'
        id: any
        wishlists: {
            __typename?: 'WishlistConnection'
            totalCount: number
            hasNextPage: boolean
            nodes: Array<{
                __typename?: 'Wishlist'
                id: any
                name: string
                createdAt: any
                lastUpdatedAt: any
                productVariants: {
                    __typename?: 'ProductVariantConnection'
                    totalCount: number
                }
            }>
        }
    }
}

export type AddWishlistMutationVariables = Exact<{
    input: AddWishlistInput
}>

export type AddWishlistMutation = {
    __typename?: 'Mutation'
    addWishlist: {
        __typename?: 'Wishlist'
        id: any
        name: string
        createdAt: any
        lastUpdatedAt: any
        productVariants: {
            __typename?: 'ProductVariantConnection'
            totalCount: number
        }
    }
}

export type DeleteWishlistMutationVariables = Exact<{
    id: Scalars['UUID']['input']
}>

export type DeleteWishlistMutation = {
    __typename?: 'Mutation'
    deleteWishlist: boolean
}

export const CurrentVersionFragmentDoc = gql`
    fragment currentVersion on ProductVariantVersion {
        id
        name
        description
        retailPrice
        canBeReturnedForDays
        version
        createdAt
    }
`
export const DefaultProductVariantFragmentDoc = gql`
    fragment defaultProductVariant on Product {
        id
        isPubliclyVisible
        defaultVariant {
            id
            isPubliclyVisible
            currentVersion {
                ...currentVersion
            }
        }
        variants {
            totalCount
        }
    }
    ${CurrentVersionFragmentDoc}
`
export const CharacteristicFragmentDoc = gql`
    fragment characteristic on CategoryCharacteristic {
        __typename
        id
        name
        ... on CategoricalCategoryCharacteristic {
            values {
                totalCount
                nodes {
                    value
                }
            }
        }
        ... on NumericalCategoryCharacteristic {
            unit
        }
    }
`
export const WishlistFragmentDoc = gql`
    fragment wishlist on Wishlist {
        id
        name
        createdAt
        lastUpdatedAt
        productVariants {
            totalCount
        }
    }
`
export const GetDefaultProductVariantsDocument = gql`
    query getDefaultProductVariants(
        $first: Int
        $skip: Int
        $orderBy: ProductOrderInput
    ) {
        products(first: $first, skip: $skip, orderBy: $orderBy) {
            totalCount
            hasNextPage
            nodes {
                ...defaultProductVariant
            }
        }
    }
    ${DefaultProductVariantFragmentDoc}
`
export const GetCategoryWithCharacteristicsAndDefaultProductVariantsDocument = gql`
    query getCategoryWithCharacteristicsAndDefaultProductVariants(
        $id: UUID!
        $firstProducts: Int
        $skipProducts: Int
        $orderProductsBy: ProductOrderInput
    ) {
        category(id: $id) {
            id
            name
            description
            characteristics {
                totalCount
                nodes {
                    ...characteristic
                }
            }
            products(
                first: $firstProducts
                skip: $skipProducts
                orderBy: $orderProductsBy
            ) {
                totalCount
                hasNextPage
                nodes {
                    ...defaultProductVariant
                }
            }
        }
    }
    ${CharacteristicFragmentDoc}
    ${DefaultProductVariantFragmentDoc}
`
export const GetCategoriesWithTotalCountOfProductsDocument = gql`
    query getCategoriesWithTotalCountOfProducts(
        $first: Int
        $skip: Int
        $orderBy: CategoryOrderInput
    ) {
        categories(first: $first, skip: $skip, orderBy: $orderBy) {
            totalCount
            hasNextPage
            nodes {
                id
                name
                products {
                    totalCount
                    nodes {
                        isPubliclyVisible
                        variants {
                            totalCount
                            nodes {
                                isPubliclyVisible
                            }
                        }
                    }
                }
            }
        }
    }
`
export const GetCategoriesWithCharacteristicsDocument = gql`
    query getCategoriesWithCharacteristics(
        $first: Int
        $skip: Int
        $orderBy: CategoryOrderInput
    ) {
        categories(first: $first, skip: $skip, orderBy: $orderBy) {
            totalCount
            hasNextPage
            nodes {
                id
                name
                characteristics {
                    totalCount
                    nodes {
                        ...characteristic
                    }
                }
            }
        }
    }
    ${CharacteristicFragmentDoc}
`
export const GetProductDocument = gql`
    query getProduct($id: UUID!) {
        product(id: $id) {
            id
            isPubliclyVisible
            internalName
            defaultVariant {
                id
            }
            variants {
                totalCount
                nodes {
                    id
                    isPubliclyVisible
                    currentVersion {
                        id
                        name
                        description
                        retailPrice
                        canBeReturnedForDays
                        version
                        createdAt
                        characteristicValues {
                            totalCount
                            nodes {
                                __typename
                                characteristic {
                                    id
                                    name
                                    category {
                                        id
                                    }
                                }
                                ... on CategoricalCategoryCharacteristicValue {
                                    categoricalValue: value
                                }
                                ... on NumericalCategoryCharacteristicValue {
                                    numericalValue: value
                                }
                            }
                        }
                    }
                }
            }
            categories {
                totalCount
                nodes {
                    id
                    name
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
export const CreateNewProductVariantVersionDocument = gql`
    mutation createNewProductVariantVersion(
        $input: CreateProductVariantVersionInput!
    ) {
        createProductVariantVersion(input: $input) {
            id
        }
    }
`
export const CreateCategoryDocument = gql`
    mutation createCategory($input: CreateCategoryInput!) {
        createCategory(input: $input) {
            id
        }
    }
`
export const CreateCategoricalCategoryCharacteristicDocument = gql`
    mutation createCategoricalCategoryCharacteristic(
        $input: CreateCategoricalCategoryCharacteristicInput!
    ) {
        createCategoricalCategoryCharacteristic(input: $input) {
            id
        }
    }
`
export const CreateNumericalCategoryCharacteristicDocument = gql`
    mutation createNumericalCategoryCharacteristic(
        $input: CreateNumericalCategoryCharacteristicInput!
    ) {
        createNumericalCategoryCharacteristic(input: $input) {
            id
        }
    }
`
export const GetUserWithWishlistsDocument = gql`
    query getUserWithWishlists(
        $userId: UUID!
        $firstWishlists: Int
        $skipWishlist: Int
        $orderWishlistsBy: WishlistOrderInput
    ) {
        user(id: $userId) {
            id
            wishlists(
                first: $firstWishlists
                skip: $skipWishlist
                orderBy: $orderWishlistsBy
            ) {
                totalCount
                hasNextPage
                nodes {
                    ...wishlist
                }
            }
        }
    }
    ${WishlistFragmentDoc}
`
export const AddWishlistDocument = gql`
    mutation addWishlist($input: AddWishlistInput!) {
        addWishlist(input: $input) {
            ...wishlist
        }
    }
    ${WishlistFragmentDoc}
`
export const DeleteWishlistDocument = gql`
    mutation deleteWishlist($id: UUID!) {
        deleteWishlist(id: $id)
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
        getDefaultProductVariants(
            variables?: GetDefaultProductVariantsQueryVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<GetDefaultProductVariantsQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<GetDefaultProductVariantsQuery>(
                        GetDefaultProductVariantsDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'getDefaultProductVariants',
                'query',
                variables
            )
        },
        getCategoryWithCharacteristicsAndDefaultProductVariants(
            variables: GetCategoryWithCharacteristicsAndDefaultProductVariantsQueryVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<GetCategoryWithCharacteristicsAndDefaultProductVariantsQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<GetCategoryWithCharacteristicsAndDefaultProductVariantsQuery>(
                        GetCategoryWithCharacteristicsAndDefaultProductVariantsDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'getCategoryWithCharacteristicsAndDefaultProductVariants',
                'query',
                variables
            )
        },
        getCategoriesWithTotalCountOfProducts(
            variables?: GetCategoriesWithTotalCountOfProductsQueryVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<GetCategoriesWithTotalCountOfProductsQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<GetCategoriesWithTotalCountOfProductsQuery>(
                        GetCategoriesWithTotalCountOfProductsDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'getCategoriesWithTotalCountOfProducts',
                'query',
                variables
            )
        },
        getCategoriesWithCharacteristics(
            variables?: GetCategoriesWithCharacteristicsQueryVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<GetCategoriesWithCharacteristicsQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<GetCategoriesWithCharacteristicsQuery>(
                        GetCategoriesWithCharacteristicsDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'getCategoriesWithCharacteristics',
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
        createNewProductVariantVersion(
            variables: CreateNewProductVariantVersionMutationVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<CreateNewProductVariantVersionMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<CreateNewProductVariantVersionMutation>(
                        CreateNewProductVariantVersionDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'createNewProductVariantVersion',
                'mutation',
                variables
            )
        },
        createCategory(
            variables: CreateCategoryMutationVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<CreateCategoryMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<CreateCategoryMutation>(
                        CreateCategoryDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'createCategory',
                'mutation',
                variables
            )
        },
        createCategoricalCategoryCharacteristic(
            variables: CreateCategoricalCategoryCharacteristicMutationVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<CreateCategoricalCategoryCharacteristicMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<CreateCategoricalCategoryCharacteristicMutation>(
                        CreateCategoricalCategoryCharacteristicDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'createCategoricalCategoryCharacteristic',
                'mutation',
                variables
            )
        },
        createNumericalCategoryCharacteristic(
            variables: CreateNumericalCategoryCharacteristicMutationVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<CreateNumericalCategoryCharacteristicMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<CreateNumericalCategoryCharacteristicMutation>(
                        CreateNumericalCategoryCharacteristicDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'createNumericalCategoryCharacteristic',
                'mutation',
                variables
            )
        },
        getUserWithWishlists(
            variables: GetUserWithWishlistsQueryVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<GetUserWithWishlistsQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<GetUserWithWishlistsQuery>(
                        GetUserWithWishlistsDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'getUserWithWishlists',
                'query',
                variables
            )
        },
        addWishlist(
            variables: AddWishlistMutationVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<AddWishlistMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<AddWishlistMutation>(
                        AddWishlistDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'addWishlist',
                'mutation',
                variables
            )
        },
        deleteWishlist(
            variables: DeleteWishlistMutationVariables,
            requestHeaders?: GraphQLClientRequestHeaders
        ): Promise<DeleteWishlistMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<DeleteWishlistMutation>(
                        DeleteWishlistDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'deleteWishlist',
                'mutation',
                variables
            )
        },
    }
}
export type Sdk = ReturnType<typeof getSdk>
