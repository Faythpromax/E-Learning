import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  fontSize: '14px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  outline: 'none',
  color: '#111827',
  backgroundColor: '#ffffff',
  boxSizing: 'border-box',
};

const columnCardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  border: '1px solid #e9d5ff',
  padding: '16px',
};

const actionButtonStyle = (variant) => {
  const variants = {
    default: { backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' },
    selected: { backgroundColor: '#2563eb', color: '#ffffff', border: '1px solid #2563eb' },
    matched: { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac' },
    disabled: { backgroundColor: '#f9fafb', color: '#9ca3af', border: '1px solid #e5e7eb', cursor: 'not-allowed' },
    active: { backgroundColor: '#dbeafe', color: '#1d4ed8', border: '1px solid #93c5fd' },
  };
  return {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    ...variants[variant],
  };
};

export function MatchingBuilder({ data, onChange, onSave, onCancel }) {
  const [leftItems, setLeftItems] = useState(data.left || ['', '']);
  const [rightItems, setRightItems] = useState(data.right || ['', '']);
  const [correctMatches, setCorrectMatches] = useState(data.correct_matches || {});
  const [matchStep, setMatchStep] = useState({ left: null, right: null });

  const updateLeft = (index, value) => {
    const newLeft = [...leftItems];
    newLeft[index] = value;
    setLeftItems(newLeft);
    onChange?.({ left: newLeft, right: rightItems, correct_matches: correctMatches });
  };

  const updateRight = (index, value) => {
    const newRight = [...rightItems];
    newRight[index] = value;
    setRightItems(newRight);
    onChange?.({ left: leftItems, right: newRight, correct_matches: correctMatches });
  };

  const addPair = () => {
    if (leftItems.length < 8) {
      setLeftItems([...leftItems, '']);
      setRightItems([...rightItems, '']);
    }
  };

  const removePair = (index) => {
    if (leftItems.length > 2) {
      const newLeft = leftItems.filter((_, i) => i !== index);
      const newRight = rightItems.filter((_, i) => i !== index);
      setLeftItems(newLeft);
      setRightItems(newRight);
      const newMatches = {};
      Object.entries(correctMatches).forEach(([k, v]) => {
        const oldLeft = parseInt(k);
        const oldRight = parseInt(v);
        if (oldLeft < index && oldRight < index) {
          newMatches[oldLeft] = oldRight;
        } else if (oldLeft < index && oldRight > index) {
          newMatches[oldLeft] = oldRight - 1;
        } else if (oldLeft > index && oldRight < index) {
          newMatches[oldLeft - 1] = oldRight;
        } else if (oldLeft > index && oldRight > index) {
          newMatches[oldLeft - 1] = oldRight - 1;
        }
      });
      setCorrectMatches(newMatches);
    }
  };

  const handleMatchClick = (side, index) => {
    if (matchStep.left === null && side === 'left') {
      setMatchStep({ left: index, right: null });
    } else if (matchStep.left !== null && side === 'right') {
      const newMatches = { ...correctMatches, [matchStep.left]: index };
      setCorrectMatches(newMatches);
      setMatchStep({ left: null, right: null });
      onChange?.({ left: leftItems, right: rightItems, correct_matches: newMatches });
    } else if (side === 'left') {
      setMatchStep({ left: index, right: null });
    }
  };

  const clearMatch = (leftIndex) => {
    const newMatches = { ...correctMatches };
    delete newMatches[leftIndex];
    setCorrectMatches(newMatches);
    onChange?.({ left: leftItems, right: rightItems, correct_matches: newMatches });
  };

  const handleSave = () => {
    if (leftItems.some((l) => !l.trim()) || rightItems.some((r) => !r.trim())) {
      alert('Vui lòng nhập đầy đủ nội dung các cặp');
      return;
    }
    if (Object.keys(correctMatches).length !== leftItems.length) {
      alert('Vui lòng nối đủ các cặp');
      return;
    }
    onSave({
      left: leftItems,
      right: rightItems,
      correct_matches: correctMatches,
    });
  };

  const isLeftSelected = (index) => matchStep.left === index;
  const isRightMatchable = (index) => matchStep.left !== null && !Object.values(correctMatches).includes(index);
  const isLeftMatched = (index) => index.toString() in correctMatches;

  const renderLeftRow = (item, index) => (
    <div key={`left-${index}`} style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '700',
          color: '#6b7280',
          flexShrink: 0,
        }}>
          {index + 1}
        </span>
        <input
          type="text"
          value={item}
          onChange={(e) => updateLeft(index, e.target.value)}
          placeholder={`Mục ${index + 1}`}
          style={{ ...inputStyle, flex: 1 }}
        />
        {leftItems.length > 2 && (
          <button
            type="button"
            onClick={() => removePair(index)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              border: 'none',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '8px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            title="Xóa cặp"
          >
            <FiTrash2 size={14} />
          </button>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', marginLeft: '42px' }}>
        <button
          type="button"
          onClick={() => handleMatchClick('left', index)}
          style={actionButtonStyle(
            isLeftSelected(index) ? 'selected' : isLeftMatched(index) ? 'matched' : 'default'
          )}
        >
          {isLeftMatched(index) ? 'Đã nối' : isLeftSelected(index) ? 'Đang chọn' : 'Chọn để nối'}
        </button>
        {isLeftMatched(index) && (
          <button
            type="button"
            onClick={() => clearMatch(index)}
            style={{ ...actionButtonStyle('default'), color: '#dc2626' }}
          >
            Huỷ nối
          </button>
        )}
      </div>
    </div>
  );

  const renderRightRow = (item, index) => (
    <div key={`right-${index}`} style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '700',
          color: '#6b7280',
          flexShrink: 0,
        }}>
          {index + 1}
        </span>
        <input
          type="text"
          value={item}
          onChange={(e) => updateRight(index, e.target.value)}
          placeholder={`Đáp án ${index + 1}`}
          style={{ ...inputStyle, flex: 1 }}
        />
      </div>
      <div style={{ marginTop: '8px', marginLeft: '42px' }}>
        <button
          type="button"
          onClick={() => handleMatchClick('right', index)}
          disabled={!isRightMatchable(index) && !Object.values(correctMatches).includes(index)}
          style={actionButtonStyle(
            Object.values(correctMatches).includes(index)
              ? 'matched'
              : isRightMatchable(index)
              ? 'active'
              : 'disabled'
          )}
        >
          {Object.values(correctMatches).includes(index) ? 'Đã nối' : 'Nối vào đây'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#6d28d9', margin: '0 0 6px 0' }}>
          Câu hỏi nối cột (Matching)
        </h3>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5' }}>
          Nhập nội dung, chọn mục ở cột trái trước, sau đó bấm &quot;Nối vào đây&quot; ở cột phải tương ứng.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '20px',
      }}>
        <div style={columnCardStyle}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#374151', margin: '0 0 16px 0' }}>
            Cột trái
          </h4>
          {leftItems.map(renderLeftRow)}
        </div>

        <div style={columnCardStyle}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#374151', margin: '0 0 16px 0' }}>
            Cột phải
          </h4>
          {rightItems.map(renderRightRow)}
        </div>
      </div>

      <button
        type="button"
        onClick={addPair}
        disabled={leftItems.length >= 8}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 0',
          marginBottom: '16px',
          background: 'none',
          border: 'none',
          color: leftItems.length >= 8 ? '#9ca3af' : '#7c3aed',
          fontSize: '14px',
          fontWeight: '600',
          cursor: leftItems.length >= 8 ? 'not-allowed' : 'pointer',
        }}
      >
        <FiPlus size={16} />
        Thêm cặp
      </button>

      <div style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '20px',
      }}>
        <p style={{ fontSize: '13px', color: '#92400e', margin: 0 }}>
          <strong>Đã nối:</strong> {Object.keys(correctMatches).length}/{leftItems.length} cặp
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        paddingTop: '16px',
        borderTop: '1px solid #e9d5ff',
        flexWrap: 'wrap',
      }}>
        <button
          type="button"
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
          className="hover:bg-blue-700"
        >
          Lưu cấu hình
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffffff',
            color: '#374151',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            cursor: 'pointer',
          }}
          className="hover:bg-gray-50"
        >
          Huỷ
        </button>
      </div>
    </div>
  );
}

export default MatchingBuilder;
