import Image from "next/image";
import Link from "../components/ui/Link.client";

const Index = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 lg:flex-row lg:justify-between">
      <div className="w-full lg:order-2 lg:w-1/2">
        <div className="mx-auto w-72 sm:w-96 lg:w-[30rem] xl:w-[35rem]">
          <Image
            src="/images/landing.svg"
            width={1099.2}
            height={725.77}
            layout="responsive"
            alt=""
          />
        </div>
      </div>
      <div className="w-full text-center lg:w-1/2 lg:text-left">
        <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-50 lg:text-5xl">
          the essential to every party
        </h1>
        <h2 className="mb-4 text-lg font-semibold text-slate-500 dark:text-slate-400 lg:text-xl">
          manage song requests, music priority, and share it all on jockey ––
          and keep your guests in the groove at the same time
        </h2>
        <Link theme="primary" href="#">
          use jockey
        </Link>
      </div>
    </main>
  );
};

export default Index;
