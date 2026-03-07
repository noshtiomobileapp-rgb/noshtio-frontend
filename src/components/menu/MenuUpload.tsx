import { Router, Request, Response } from "express";
import multer from "multer";
import { VendorMenuDraft } from "../models/VendorMenuDraft.model";
import { requireAuth } from "../middleware/requireAuth";

type MenuUploadRequest = Request & {
  user?: { id: string; role: string };
  file?: Express.Multer.File;
};

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

/* ============================================================
   GET /api/vendor/menu/current
============================================================ */
router.get("/current", requireAuth, async (req: Request, res: Response) => {
  try {
    const authReq = req as MenuUploadRequest;
    const vendorId = authReq.user?.id;

    if (!vendorId) return res.status(401).json({ message: "Unauthorized" });

    const draft = await VendorMenuDraft.findOne({ vendorId, status: "DRAFT" });

    // FIX: Return an empty structure instead of null to prevent frontend crashes
    if (!draft) {
      return res.status(200).json({ snapshotId: null, items: [], status: "NONE" });
    }

    return res.status(200).json({
      snapshotId: draft._id.toString(),
      items: draft.items,
      status: draft.status,
    });
  } catch (err) {
    console.error("GET /current failed", err);
    return res.status(500).json({ message: "Server Error" });
  }
});

/* ============================================================
   POST /api/vendor/menu/upload
============================================================ */
router.post("/upload", requireAuth, upload.single("file"), async (req: Request, res: Response) => {
  try {
    const authReq = req as MenuUploadRequest;
    const vendorId = authReq.user?.id;

    if (!vendorId || !authReq.file) {
      return res.status(400).json({ success: false, message: "Missing file or auth" });
    }

    const text = authReq.file.buffer.toString("utf-8");
    const items = text.split("\n").map(l => l.trim()).filter(Boolean).map(name => ({
      name,
      price: null,
    }));

    const draft = await VendorMenuDraft.findOneAndUpdate(
      { vendorId },
      { vendorId, items, status: "DRAFT" },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      snapshotId: draft!._id.toString(),
      items: draft!.items,
    });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

export default router;