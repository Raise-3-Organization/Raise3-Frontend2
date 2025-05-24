import { useCallback, useEffect, useState } from "react";

export const useMileStoneLen = ( mileStoneLen: number ) => {
    const [mileStoneLength, setMileStoneLength] = useState<Map<string, string>>(new Map());
  const getMileStoneLen = useCallback(() => {
    try {
      if (!mileStoneLen) {
        console.log("mileStoneLen is undefined or null");
        return;
      }

      const newMap = new Map<string, string>();
      // if (typeof mileStoneLen === 'bigint' && mileStoneLen > 0) {
        for (let i = 0; i < mileStoneLen; i++) {
          newMap.set(i.toString(), i.toString());
        }
        setMileStoneLength(new Map(newMap));
      // } else {
      //   console.log("mileStoneLen is not a valid bigint:", mileStoneLen);
      // }
    } catch (error) {
      console.error("Error setting milestone IDs:", error);
    }
  }, [mileStoneLen]);

  useEffect(() => {
    getMileStoneLen();
  }, [mileStoneLen, getMileStoneLen]);

  return { mileStoneLength };
};
