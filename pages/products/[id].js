import React from "react";

const Product = ({ product }) => {
    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>{product.price}</p>
        </div>
    );
};

export default Product;

export async function getStaticProps(context) {
    const { id } = context.params;

    const res = await fetch("https://api.shopify.com/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_API_KEY,
        },
        body: JSON.stringify({
            query: `
            {
                product(handle: "test-product") {
                    id
                    title
                    description
                    priceRange {
                        maxVariantPrice {
                            amount
                        }
                    }
                    images(first: 1) {
                        edges {
                            node {
                                originalSrc
                            }
                        }
                    }
                }
            }
        `,
        }),
    });

    const { data } = await res.json();

    return {
        props: {
            products: data.product,
        },
        revalidate: 10,
    };
}

export async function getStaticPaths() {
    const res = await fetch("https://.../posts");
    const posts = await res.json();

    // Get the paths we want to pre-render based on posts
    const paths = posts.map((post) => ({
        params: { id: post.id },
    }));

    // We'll pre-render only these paths at build time.
    // { fallback: blocking } will server-render pages
    // on-demand if the path doesn't exist.
    return { paths, fallback: "blocking" };
}
