import cabinet from "@/assets/images/cabinet/cabinet.png";
import blackTab from "@/assets/images/cabinet/tab-black.png";
import tab from "@/assets/images/cabinet/tab.png";
import { useImagePreloader } from "@/hooks/use-image-preloader";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import Cabinet from "../../../components/portfolio/cabinet";

const About = () => {
    const imageUrls = useMemo(() => [cabinet, tab, blackTab], []);

    // preload images to prevent strange appearance when images haven't loaded yet
    const imagesLoaded = useImagePreloader(imageUrls);

    if (!imagesLoaded) {
        return (
            <section className="flex h-[calc(100vh-8rem)] items-center justify-center">
                <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </section>
        );
    }

    return (
        <section className="flex h-screen flex-col pb-[20vh] sm:pb-[10vh]">
            {/* percise p and m calculations to make responsive, weird but it works */}
            <div className="relative -mb-[100px] flex w-full flex-1 scale-[80%] items-end justify-center md:scale-[110%] lg:scale-[130%] xl:scale-[150%] 2xl:scale-[180%]">

                <Cabinet />
            </div>
        </section>
    );
};

export default About;
