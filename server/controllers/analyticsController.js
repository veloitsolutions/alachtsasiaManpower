import asyncHandler from 'express-async-handler';
import WorkerAnalytics from '../models/workerAnalytics.js';
import Manpower from '../models/manpower.js';

// @desc    Track analytics events
// @route   POST /api/analytics/save
// @access  Public
const trackAnalyticsEvents = asyncHandler(async (req, res) => {
  try {
    const events = Array.isArray(req.body) ? req.body : [req.body];

    for (const event of events) {
      const { userType, userId, workerId, actionType } = event;

      if (!userType || !workerId || !actionType) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields in one or more events'
        });
      }

      await WorkerAnalytics.create({
        userType,
        userId,
        workerId,
        actionType: actionType.toUpperCase(),
      });
    }

    res.json({ success: true, message: 'Analytics event(s) saved' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving analytics event(s)',
      error: error.message
    });
  }
});

// @desc    Get worker stats
// @route   POST /api/analytics/worker-data
// @access  Private/Admin
const getWorkerStats = asyncHandler(async (req, res) => {
  try {
    const stats = await WorkerAnalytics.aggregate([
      {
        $group: {
          _id: {
            workerId: "$workerId",
            actionType: "$actionType"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.workerId",
          stats: {
            $push: {
              k: "$_id.actionType",
              v: "$count"
            }
          }
        }
      },
      {
        $lookup: {
          from: 'manpowers',
          localField: '_id',
          foreignField: '_id',
          as: 'worker'
        }
      },
      {
        $unwind: '$worker'
      },
      {
        $project: {
          workerId: '$_id',
          workerNameEng: '$worker.nameEng',
          workerNameArabic: '$worker.nameArabic',
          stats: { $arrayToObject: '$stats' }
        }
      }
    ]);

    res.json(stats);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting worker stats',
      error: error.message
    });
  }
});

export {
  trackAnalyticsEvents,
  getWorkerStats
};
