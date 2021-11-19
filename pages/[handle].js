import React from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Product = ({ product }) => {
    return (
        <div className={styles.card} key={product?.id}>
            <Image
                src={product?.images.edges[0].node.originalSrc}
                alt={product?.title}
                width={250}
                height={250}
            />
            {/* {console.log(product)} */}
            <h2 className={styles.cardTitle}>{product?.title}</h2>
            <p className={styles.cardDescription}>{product?.description}</p>
            <p className={styles.cardPrice}>
                {product?.priceRange.minVariantPrice.amount}
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
                    products(first: 25) {
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
                    product(handle: "${handle}") {
                      
                
                          id
                          title
                          handle
                          description
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
                `,
            }),
        }
    );

    const response = await res.json();
    console.log(response);

    const product = response.data.product ? response.data.product : [];

    return {
        props: {
            product,
        },
        revalidate: 10,
    };
}
