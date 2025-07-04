"use client";

import { CardBody, CardContainer, CardItem } from "./ui/3d-card";

interface ProductCard3dProps {
  img: string;
}

export function ProductCard3dComponent({ img }: ProductCard3dProps) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[36rem] h-auto rounded-xl p-4 border">
        <CardItem translateZ="100" className="w-full">
          <img
            src={img || "https://via.placeholder.com/400"}
            height="2000"
            width="2000"
            className="h-[400px] w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
