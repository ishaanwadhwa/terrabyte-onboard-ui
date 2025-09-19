import { HelmetProvider, Helmet } from "react-helmet-async";

const PageMeta = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image?: string;
}) => (
  <Helmet>
    <title>{title} | TerraByte AI</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={`${title} | TerraByte AI`} />
    <meta property="og:description" content={description} />
    {image && <meta property="og:image" content={image} />}
    <meta name="twitter:title" content={`${title} | TerraByte AI`} />
    <meta name="twitter:description" content={description} />
    {image && <meta name="twitter:image" content={image} />}
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
