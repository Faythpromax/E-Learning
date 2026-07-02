import NotificationItem from './NotificationItem';

const NotificationDropdown = ({
  notifications,
  onRead
}) => {
  return (
    <div className="notification-dropdown">
      <div className="notification-header flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <span className="font-bold text-gray-800">Thông báo</span>
        <button
          onClick={onRead}
          className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          Đánh dấu đã đọc
        </button>
      </div>

      <div className="max-h-[350px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="notification-empty py-8 text-center text-gray-400 text-sm">
            Chưa có thông báo
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={onRead}
            />
          ))
        )}
      </div>

      <div className="notification-footer text-center py-2.5 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
        <button className="text-xs text-blue-600 hover:text-blue-700 font-bold transition-colors">
          Xem tất cả
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;