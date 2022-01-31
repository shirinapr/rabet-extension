import React, { useEffect } from 'react';
import classNames from 'classnames';

type Layout1Props = {
  children: JSX.Element | JSX.Element[];
  alignCenter?: boolean;
  className?: string;
  isDashboard?: boolean;
};

const Layout1 = ({
  children,
  alignCenter,
  className,
  isDashboard,
}: Layout1Props) => {
  useEffect(() => {
    if (isDashboard) {
      document.body.className = 'dashboard';
    }
    return () => {
      document.body.className = '';
    };
  });
  return (
    <>
      {isDashboard ? (
        children
      ) : (
        <div
          className={classNames(
            `flex h-screen justify-center ${
              alignCenter ? 'place-items-center' : ' '
            }`,
            className,
          )}
        >
          <div className="2xl:basis-1/3 2xl:mt-[55px] xl:basis-1/3 lg:basis-2/5 md:basis-2/4 sm:basis-3/5 basis-11/12">
            {children}
          </div>
        </div>
      )}
    </>
  );
};

Layout1.defaultProps = {
  alignCenter: false,
  className: '',
  isDashboard: true,
};

export default Layout1;
