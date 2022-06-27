import { useEffect } from "react";
import { Button } from "@mantine/core";
import type { NextPage } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";

import styles from "../styles/Home.module.css";

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);
  return {
    props: { session },
  };
}

const Home: NextPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut();
    }
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/posts");
      const json = await res.json();
      console.log("🚀 ~ file: index.tsx ~ line 30 ~ fetchData ~ json", json);
    };
    session && fetchData();
  }, [session]);

  const postSomethingNew = async () => {
    await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Hello there~",
        body: "general Kenobiii!",
      }),
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Button onClick={() => (session ? signOut() : signIn("soul"))}>
          {session ? "Sign out" : "Sign in"}
        </Button>
        <Button onClick={postSomethingNew}>Post something</Button>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
