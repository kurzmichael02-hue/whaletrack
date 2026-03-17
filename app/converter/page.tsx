import TokenConverter from "../components/TokenConverter";
import SocialSentiment from "../components/SocialSentiment";
import StakingTracker from "../components/StakingTracker";
import NFTHoldings from "../components/NFTHoldings";

export default function ToolsPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <TokenConverter />
      <SocialSentiment />
      <StakingTracker />
      <NFTHoldings />
    </div>
  );
}