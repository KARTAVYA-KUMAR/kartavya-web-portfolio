import type React from "react";
import DividerFile from "@/components/portfolio/cabinet-files/divider-file";


import CertificateFile from "./cabinet-files/certificate-file";
import cert1 from "@/assets/images/certificates/1.png";
import cert2 from "@/assets/images/certificates/2.png";
import cert3 from "@/assets/images/certificates/3.png";
import cert4 from "@/assets/images/certificates/4.png";
import cert5 from "@/assets/images/certificates/5.png";
import cert6 from "@/assets/images/certificates/6.png";
import cert7 from "@/assets/images/certificates/7.png";
import cert8 from "@/assets/images/certificates/8.png";
import cert9 from "@/assets/images/certificates/9.png";

export type File = {
    tabLocation: 0 | 1 | 2;
    isDivider?: boolean;
    title: string;
    content: React.ReactNode;
};

export const loremIpsum =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin nulla erat, sed iaculis nisi ornare vel. Curabitur efficitur, felis a ullamcorper dignissim, erat nulla dapibus mi, sed rutrum nisi felis sed lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin nulla erat, sed iaculis nisi ornare vel.";

const cabinetLayout: File[] = [
    {
        tabLocation: 0,
        isDivider: true,
        title: "Education",
        content: <CertificateFile imgSrc={cert1} text="this is the certificate of nptel" />,
    },
    {
        tabLocation: 1,
        title: "University",
        content: <CertificateFile imgSrc={cert2} text="this is the certificate of lpu" />,
    },
    {
        tabLocation: 2,
        title: "---",
        content: <CertificateFile imgSrc={cert3} text="this is the certificate of aws" />,
    },
    {
        tabLocation: 0,
        title: "---",
        content: <CertificateFile imgSrc={cert4} text="this is the certificate of infosys" />,
    },
    {
        tabLocation: 1,
        isDivider: true,
        title: "Experience",
        content: <CertificateFile imgSrc={cert5} text="this is the certificate of jpmorgan chase" />,
    },
    {
        tabLocation: 2,
        title: "Internship",
        content: <CertificateFile imgSrc={cert6} text="this is the certificate of freecodecamp" />,
    },
    {
        tabLocation: 0,
        title: "Research",
        content: <CertificateFile imgSrc={cert7} text="this is the certificate of infosys c programming" />,
    },
    {
        tabLocation: 1,
        title: "Skills",
        content: <CertificateFile imgSrc={cert8} text="this is the certificate of microsoft learn student ambassador" />,
    },
    {
        tabLocation: 0,
        title: "---",
        content: <CertificateFile imgSrc={cert9} text="this is the certificate of infosys prompt engineering" />,
    },
    {
        tabLocation: 2,
        isDivider: true,
        title: "Projects",
        content: <DividerFile title="Projects" />,
    },
];

export default cabinetLayout;
