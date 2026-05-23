import { FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';

export function TestSubmitModal({ isOpen, onClose, onSubmit, totalQuestions, answeredCount, isSubmitting }) {
  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;
  const unansweredPercentage = Math.round((unansweredCount / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {unansweredCount > 0 ? (
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <FiAlertTriangle className="text-2xl text-yellow-600" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheck className="text-2xl text-green-600" />
            </div>
          )}
          <h2 className="text-xl font-bold text-gray-800">Xac nhan noi bai</h2>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Ban co chac chan muon noi bai kiem tra nay khong?
          </p>

          {/* Stats */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center gap-2">
                <FiCheck className="text-green-500" />
                Cau hoi da tra loi
              </span>
              <span className="font-semibold text-gray-800">{answeredCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center gap-2">
                <FiX className="text-gray-400" />
                Cau hoi chua tra loi
              </span>
              <span className={`font-semibold ${unansweredCount > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                {unansweredCount}
              </span>
            </div>
          </div>

          {/* Warning */}
          {unansweredCount > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Luu y:</strong> Ban con <strong>{unansweredCount}</strong> cau hoi chua tra loi 
                ({unansweredPercentage}% bai thi). Cac cau hoi chua tra loi se khong duoc cham diem.
              </p>
            </div>
          )}

          {unansweredCount === 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                Ban da tra loi tat ca cac cau hoi. San sang de noi bai!
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            Quay lai
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⟳</span>
                Dang noi...
              </>
            ) : (
              <>
                <FiCheck />
                Xac nhan noi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestSubmitModal;
