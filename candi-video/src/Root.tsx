import { Composition } from "remotion";
import { CandiDemo } from "./CandiDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CandiDemo"
      component={CandiDemo}
      durationInFrames={540}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
