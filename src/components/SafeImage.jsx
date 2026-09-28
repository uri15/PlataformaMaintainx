import React from 'react';
import { Icon } from './Icon.jsx';

export const SafeImage = ({
  src,
  alt = '',
  className = '',
  fallbackIcon = 'photo',
  fallbackContent = null,
  onClick = null,
  title = ''
}) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    if (fallbackContent) {
      return (
        <div className={className} onClick={onClick} title={title}>
          {fallbackContent}
        </div>
      );
    }
    return (
      <div 
        className={`flex items-center justify-center bg-slate-100 text-slate-400 select-none ${className}`}
        onClick={onClick}
        title={title || 'Imagen no disponible'}
      >
        <Icon name={fallbackIcon} className="w-1/2 h-1/2 opacity-70" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      title={title}
      onError={(e) => {
        // PREVENCIÓN DE BUCLE INFINITO: Desvincula el listener para evitar reintentos continuos
        e.currentTarget.onerror = null;
        setHasError(true);
      }}
    />
  );
};

// Header — CON BÚSQUEDA INTERACTIVA EN TIEMPO REAL Y CENTRO DE NOTIFICACIONES / NOVEDADES;
