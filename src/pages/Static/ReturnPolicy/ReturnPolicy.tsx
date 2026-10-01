import { useLangStore } from "@/stores/languageStore";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";

interface ReturnPolicyTranslation {
    title: string;
    description: string;
    imageAlt: string;
    rulesList: string;
    rules: string[];
    contactTitle: string;
    contactButton: string;
}

const ReturnPolicy = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const dir = useLangStore(s => s.dir);
    const localizedPath = useLocalizedPath();

    const defaultPolicy = {
        title: "",
        description: "",
        imageAlt: "",
        rulesList: "",
        rules: [],
        contactTitle: "",
        contactButton: "",
    };

    const policyData =
        (t("returnPolicy", { returnObjects: true }) as ReturnPolicyTranslation) ||
        defaultPolicy;

    return (
        <main dir={dir} className="page-container page-section">
            {/* Policy Section */}
            <section
                className={`flex flex-wrap gap-6 rounded-3xl border border-color-theme bg-color-for-layer-on-body p-5 shadow-dark-sm sm:p-8 ${lang === "fa" ? "text-right" : "text-left"
                    }`}
                aria-labelledby="return-policy-heading"
            >
                {/* Image */}
                {/* <figure className="w-full lg:w-16/48 xl:w-12/48 2xl:w-12/48">
                    <img
                        src={ShopImage}
                        alt={policyData.imageAlt || policyData.title}
                        className="rounded-xl w-full h-auto object-cover"
                        loading="lazy"
                    />
                </figure> */}

                {/* Text Content */}
                <div className="flex w-full flex-col justify-between">
                    <header>
                        <h1
                            id="return-policy-heading"
                            className="text-2xl font-s-bold first-text-color md:text-3xl"
                        >
                            {policyData.title}
                        </h1>
                        <p className="mt-3 text-justify leading-8 first-text-color-for-paragraph">
                            {policyData.description}
                        </p>
                    </header>

                    {/* Rules List */}
                    <ul
                        className="mt-6 grid gap-3 sm:grid-cols-2"
                        aria-label={policyData.rulesList || policyData.title}
                    >
                        {policyData.rules.map((rule, idx) => (
                            <li key={idx} className="flex items-start gap-3 rounded-xl bg-color-for-layer-sec p-3">
                                <span
                                    className="mt-2 h-2 w-2 shrink-0 rotate-45 rounded-xs bg-secound"
                                    aria-hidden="true"
                                ></span>
                                <span className="text-sm leading-7 first-text-color-for-paragraph">
                                    {rule}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Contact Section */}
            <section
                className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-color-theme bg-color-for-layer-on-body p-5 shadow-dark-sm sm:p-8"
                aria-labelledby="contact-heading"
            >
                <div>
                    <p id="contact-heading" className="text-base first-text-color">
                        {policyData.contactTitle}
                    </p>
                </div>

                <Link
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-first px-5 py-2 text-center text-sm font-s-sbold text-white transition-colors hover:bg-first-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-first sm:w-auto"
                    to={localizedPath("/contact-us")}
                >
                    {policyData.contactButton}
                </Link>
            </section>
        </main>
    );
};

export default ReturnPolicy;
