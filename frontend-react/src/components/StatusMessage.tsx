import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface StatusMessageProps {
  message: string;
  type: 'success' | 'error' | 'warning';
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getClassName = () => {
    switch (type) {
      case 'success':
        return 'status-success';
      case 'error':
        return 'status-error';
      case 'warning':
        return 'status-warning';
      default:
        return '';
    }
  };

  return (
    <div className={`flex items-center gap-3 ${getClassName()}`}>
      {getIcon()}
      <span>{message}</span>
    </div>
  );
};

export default StatusMessage;