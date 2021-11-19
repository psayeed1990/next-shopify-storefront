import React from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Product = ({ product }) => {
    return (
        <div className={styles.card} key={product?.node.id}>
            <Image
                src={product?.node.images.edges[0].node.originalSrc}
                alt={product?.node.title}
                width={250}
                height={250}
            />
            {/* {console.log(product)} */}
            <h2 className={styles.cardTitle}>{product?.node.title}</h2>
            <p className={styles.cardDescription}>Description</p>
            <p className={styles.cardPrice}>
                {product?.node.priceRange.minVariantPrice.amount}
            </p>
            <p className={styles.cardButton}>Add to Cart</p>
        </div>
    );
};

export default Product;

export async function getStaticPaths() {
    const res = await fetch(
        `https://${process.env.SHOP_ID}.myshopify.com/api/2021-10/graphql.json`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token":
                    process.env.SHOPIFY_API_KEY,
            },
            body: JSON.stringify({
                query: `
                {
                    products() {
                      edges {
                        node {
                          id
                          title
                          handle
                          priceRange {
                            minVariantPrice {
                              amount
                            }
                          }
                          images(first: 5) {
                            edges {
                              node {
                                originalSrc
                                altText
                              }
                            }
                          }
                        }
                      }
                    }
                  }`,
            }),
        }
    );

    const response = await res.json();
    const products = response.data.products.edges
        ? response.data.products.edges
        : [];

    // Get the paths we want to pre-render based on posts
    const paths = products.map((product) => ({
        params: { handle: product.node.handle },
    }));

    // We'll pre-render only these paths at build time.
    // { fallback: blocking } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: "blocking" };
}

export async function getStaticProps(context) {
    const { handle } = context.params;

    const res = await fetch(
        `https://${process.env.SHOP_ID}.myshopify.com/api/2021-10/graphql.json`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token":
                    process.env.SHOPIFY_API_KEY,
            },
            body: JSON.stringify({
                query: `{
                    productByHandle(handle: "${handle}") {
                        collections(first: 1) {
                          edges {
                          node {
                            products(first: 5) {
                              edges {
                                node {
                                  priceRange {
                                    minVariantPrice {
                                      amount
                                    }
                                  }
                                  handle
                                  title
                                  id
                                  images(first: 5) {
                                    edges {
                                      node {
                                        originalSrc
                                        altText
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        }
                      id
                      title
                      handle
                      description
                      images(first: 5) {
                        edges {
                          node {
                            originalSrc
                            altText
                          }
                        }
                      }
                      options {
                        name
                        values
                        id
                      }
                      variants(first: 25) {
                        edges {
                          node {
                            selectedOptions {
                              name
                              value
                            }
                            image {
                              originalSrc
                              altText
                            }
                            title
                            id
                            priceV2 {
                              amount
                            }
                          }
                        }
                      }
                    }
                  }
                `,
            }),
        }
    );

    const response = await res.json();
    console.log(response);
    const product = response.data.productByHandle
        ? response.data.productByHandle
        : [];

    return {
        props: {
            product,
        },
        revalidate: 10,
    };
}
