import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Client from "shopify-buy";

export default function Home({ products }) {
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to <a href="https://nextjs.org">Next.js!</a> Shopify
                    Storefront API Store
                </h1>

                <div className={styles.grid}>
                    {products.map((product) => (
                        <div className={styles.card} key={product.node.id}>
                            <Image
                                src={
                                    product.node.images.edges[0].node
                                        .originalSrc
                                }
                                alt={product.node.title}
                                width={250}
                                height={250}
                            />
                            {console.log(product.node.images)}
                            <h2 className={styles.cardTitle}>
                                {product.node.title}
                            </h2>
                            <p className={styles.cardDescription}>
                                Description
                            </p>
                            <p className={styles.cardPrice}>
                                {product.node.priceRange.minVariantPrice.amount}
                            </p>
                            <p className={styles.cardButton}>Add to Cart</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className={styles.footer}>
                <p>A NextJS app using shopify storefront api</p>
            </footer>
        </div>
    );
}

export async function getStaticProps(context) {
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

    return {
        props: {
            products,
        },
        revalidate: 10,
    };
}

// export async function getStaticProps(context) {
//     let products = [];
//     try {
//         const client = Client.buildClient({
//             storefrontAccessToken: process.env.SHOPIFY_API_KEY,
//             domain: process.env.SHOPIFY_API_ENDPOINT,
//         });

//         products = await client.product.fetchAll();
//         console.log(products);
//     } catch (error) {
//         console.error(error);
//     }
//     return {
//         props: {
//             products: products,
//         },
//     };
// }