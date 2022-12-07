import { MarkInstance, QuipuFoundation, SceneGraph } from "./utils";

const createPendantCords = (cordCount: number): MarkInstance[] => {
  // TODO verify this way of setting x coord works (like does the spacing work okay?)
  const cords = [...Array(cordCount).keys()].map((n) => ({
    x: n * 30 + 40,
    y: 0,
  }));

  return cords;
};

const createKnots = (nums: number[]): SceneGraph[] => {
  let knotsDictionary: Record<number, MarkInstance[]> = {};

  nums.forEach((num, numIdx) => {
    const digitsArray = num.toString().split("").map(Number);
    const digitsLen = digitsArray.length;

    digitsArray.forEach((digit, digitIdx) => {
      if (!digit) {
        return;
      }
      const x = numIdx * 30 + 40;
      // TODO determine better y-coord algorithm
      const y = 5 - digitsLen + digitIdx + 1;

      const knotInstance = { x: x, y: y };

      const knotID = y === 5 ? digit : digit * 10;

      if (knotsDictionary[knotID]) {
        knotsDictionary[knotID] = [...knotsDictionary[knotID], knotInstance];
      } else {
        knotsDictionary[knotID] = [knotInstance];
      }
    });
  });

  let sceneGraph: SceneGraph[] = [];

  for (let knotID in knotsDictionary) {
    const knotSceneGraph: SceneGraph = {
      mark: Number(knotID),
      markInstances: knotsDictionary[knotID],
      children: [],
    };

    sceneGraph.push(knotSceneGraph);
  }

  return sceneGraph;
};

export const createSceneGraph = (nums: number[]): SceneGraph => {
  const sceneGraph = {
    // TODO determine grid width programmatically
    mark: QuipuFoundation.Grid,
    markInstances: [{ x: 0, y: 6 }],
    children: [
      {
        // TODO determine primary cord width programmatically
        mark: QuipuFoundation.PrimaryCord,
        markInstances: [{ x: 0, y: 6 }],
        children: [
          {
            mark: QuipuFoundation.EndKnot,
            markInstances: [{ x: 0, y: 0 }],
            children: [],
          },
          {
            mark: QuipuFoundation.PendantCord,
            markInstances: [...createPendantCords(nums.length)],
            children: [...createKnots(nums)],
          },
        ],
      },
    ],
  };

  return sceneGraph;
};
