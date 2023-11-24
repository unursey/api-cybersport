import { sendData, sendError } from "./send.js";

export const handleComediansRequest = async (req, res, games, segments) => {
  if (segments.length === 2) {
    const game = games.find(c => c.id === segments[1])

    if (!game) {
      sendError(res, 404, "Stand-up комик не найден")
      return;
    }
    sendData(res, game)
    return;
  }
  sendData(res, games);
}