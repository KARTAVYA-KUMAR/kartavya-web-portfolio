import { FileContent } from "../file-content";

type Props = {
    imgSrc: string;
    text: string;
};

const CertificateFile = ({ imgSrc, text }: Props) => {
    return (
        <FileContent>
            <div className="flex w-full items-start gap-8 px-2 py-2">
                <div className="flex-shrink-0">
                    <img 
                        src={imgSrc} 
                        alt="Certificate" 
                        className="h-[180px] w-auto border border-neutral-300 bg-white p-1 shadow-sm object-contain"
                    />
                </div>
                <div className="flex-1 pt-6 text-xl tracking-tight text-[#443b3a] font-light">
                    {text}
                </div>
            </div>
        </FileContent>
    );
};

export default CertificateFile;
