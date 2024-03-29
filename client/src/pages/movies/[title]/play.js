import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Play({ movie }) {
  const previousPath = useRouter().asPath.split("/").slice(0, -1).join("/");
  return (
    <div className="w-4/5 mx-auto">
      <div className="flex justify-between py-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 ">
          <Link href="/">Movie Flix</Link>
        </h1>
        <h3 className="text-right text-red-700 align-baseline">
          <Link href={previousPath}>Go back to description &#10230;</Link>
        </h3>
      </div>

      <div className="mt-4">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900">
          {movie.title}
        </h1>
        <div
          role="status"
          className="flex items-center justify-center h-[60vh] w-4/5 mx-auto bg-gray-300 rounded-lg animate-pulse"
        >
          <svg
            className="w-12 h-12 text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 384 512"
          >
            <path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { title } = context.params;
  const { data } = await axios.get(`http://localhost:3333/movie/${title}`);
  const { movie } = data;
  return {
    props: { movie },
  };
}
