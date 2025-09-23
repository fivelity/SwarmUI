import { useLayout } from '../../contexts/LayoutProvider';

const MainLayout = ({ children }) => {
  const { layout } = useLayout();
  const style = {
    display: 'grid',
    gap: '1rem',
    gridTemplateAreas: layout.gridTemplateAreas,
    gridTemplateColumns: layout.gridTemplateColumns,
  };
  return <div style={style}>{children}</div>;
};

export default MainLayout;
