import { prisma } from "../utils/helpers.js";

const getNetVotes = async (req, res) => {
  try {
    const { templateId } = req.params;

    const template = await prisma.workoutTemplate.findUnique({
      where: { id: parseInt(templateId) },
      include: { votes: true },
    });

    if (!template) {
      return res.status(404).json({ message: "Workout template not found" });
    }

    const netVotes = calculateNetVotes(template);

    res.status(200).json({ netVotes });
  } catch (error) {
    console.error("Error fetching net votes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const calculateNetVotes = (post) => {
  let netVotes = 0;

  if (post && post.votes) {
    netVotes = post.votes.reduce((net, vote) => {
      return net + (vote.voteType === "UPVOTE" ? 1 : -1);
    }, 0);
  }

  return netVotes;
};

export { getNetVotes, calculateNetVotes };
