import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import logo from "/logo.png";

const SEOComponent = ({
  title = "Helping Hands | The number one platform for lending a financial hand and getting financial help",
  description = "Seek financial helping hands in minutes with tools to help you succeed. Helping Hands is the global leader in crowdfunding, trusted by hundreds of people.",
  keywords = "",
  url = typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:7755",
  image = logo,
}) => {
  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="icon" href={image} />
      {keywords && <meta name="keywords" content={keywords} />}
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={description} />
      <meta property="og:image:url" content={image} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

SEOComponent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  url: PropTypes.string,
  image: PropTypes.string,
  fullUrl: PropTypes.string,
};

export default SEOComponent;
