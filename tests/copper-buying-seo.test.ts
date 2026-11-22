import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMaterialServiceJsonLd } from "../src/components/seo/MaterialOfferJsonLd";
import { COPPER_BUYING } from "../src/lib/copper-buying";
import {
  buildMaterialMetadata,
  buildMaterialWhatsAppUrl,
  type MaterialPageData,
} from "../src/lib/materials";

const site = "https://theironman.co.il";
const copper: MaterialPageData = {
  id: "synthetic-material",
  slug: "copper",
  icon: "copper",
  title: "קניית נחושת",
  keyword: "קניית נחושת",
  description: "Legacy synthetic description",
  longDescription: "Legacy synthetic long description",
  seoTitle: "Legacy synthetic title",
  seoDescription: "Legacy synthetic SEO description",
  priceRange: "Synthetic fixed price",
  imageUrl: null,
  sortOrder: 1,
  isActive: true,
};

test("copper metadata retains the indexed URL and describes pricing without a live-price promise", () => {
  const metadata = buildMaterialMetadata(copper, site);
  assert.equal(metadata.alternates?.canonical, `${site}/materials/copper`);
  assert.equal(metadata.openGraph?.url, `${site}/materials/copper`);
  assert.equal(metadata.robots && typeof metadata.robots === "object" && metadata.robots.index, true);
  assert.deepEqual(metadata.title, { absolute: COPPER_BUYING.title });
  assert.match(COPPER_BUYING.title, /קונה נחושת.*מחיר נחושת לקילו/);
  assert.equal(metadata.description, COPPER_BUYING.description);
  assert.equal(metadata.openGraph?.description, metadata.description);
  assert.equal(metadata.twitter?.description, metadata.description);
  assert.doesNotMatch(metadata.description ?? "", /מעודכן|מיידי|₪|בכל הארץ/);
});

test("copper schema omits price and stock claims even with a legacy stored price", () => {
  const service = buildMaterialServiceJsonLd(copper, site);
  assert.equal(service["@type"], "Service");
  assert.equal(service.url, `${site}/materials/copper`);
  assert.equal(service.name, COPPER_BUYING.heading);
  assert.equal(service.description, COPPER_BUYING.description);
  assert.equal(Object.hasOwn(service, "offers"), false);
  assert.equal(Object.hasOwn(service, "areaServed"), false);
  assert.doesNotMatch(JSON.stringify(service), /InStock|Synthetic fixed price/);
});

test("copper WhatsApp requests the quote details while retaining the existing destination", () => {
  const generic = { ...copper, slug: "iron", title: "Synthetic iron" };
  const copperUrl = new URL(buildMaterialWhatsAppUrl(copper));
  const genericUrl = new URL(buildMaterialWhatsAppUrl(generic));
  assert.equal(copperUrl.origin, "https://wa.me");
  assert.equal(copperUrl.pathname, genericUrl.pathname);
  assert.equal(copperUrl.searchParams.get("text"), COPPER_BUYING.whatsappMessage);
  assert.match(COPPER_BUYING.whatsappMessage, /סוג החומר:[\s\S]*משקל משוער[\s\S]*יישוב:[\s\S]*תמונות/);
  assert.doesNotMatch(COPPER_BUYING.whatsappMessage, /למכור קניית|מעודכנת להיום/);
  assert.match(genericUrl.searchParams.get("text") ?? "", /Synthetic iron/);
});

test("non-copper material metadata and the stored price schema are unchanged", () => {
  const iron = { ...copper, slug: "iron", title: "Synthetic iron", icon: "iron" };
  const metadata = buildMaterialMetadata(iron, site);
  const service = buildMaterialServiceJsonLd(iron, site);
  assert.equal(metadata.alternates?.canonical, `${site}/materials/iron`);
  assert.deepEqual(metadata.title, { absolute: iron.seoTitle });
  assert.equal(metadata.description, iron.seoDescription);
  assert.equal(service.offers?.priceSpecification?.description, iron.priceRange);
  assert.equal(service.offers?.availability, "https://schema.org/InStock");
});
