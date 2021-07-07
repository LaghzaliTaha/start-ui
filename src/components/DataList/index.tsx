import React, { useContext, useState, useEffect, useRef, FC } from 'react';

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
  useBreakpointValue,
  FlexProps,
  AccordionProps,
  ChakraComponent,
  useColorModeValue,
} from '@chakra-ui/react';

export const DataListContext = React.createContext(null);
export const DataListHeaderContext = React.createContext(null);

export interface DataListCellProps extends FlexProps {
  colName?: string;
  colWidth?: string | number | Record<string, string | number>;
  isVisible?: boolean | boolean[] | Record<string, boolean>;
}

export const DataListCell: ChakraComponent<'div', DataListCellProps> = ({
  children,
  colName = null,
  colWidth = 1,
  isVisible = true,
  ...rest
}) => {
  const { columns, setColumns } = useContext(DataListContext);
  const isInHeader = useContext(DataListHeaderContext);
  const restRef = useRef<any>();
  restRef.current = rest;

  useEffect(() => {
    if (isInHeader && colName) {
      setColumns((prevColumns) => ({
        ...prevColumns,
        [colName]: { colWidth, isVisible, ...restRef.current },
      }));
    }
  }, [isInHeader, colName, colWidth, isVisible, setColumns]);

  const headerProps = !isInHeader ? columns?.[colName] || {} : {};
  const {
    isVisible: _isVisible = true,
    colWidth: _colWidth = true,
    ...cellProps
  } = {
    colWidth,
    isVisible,
    ...headerProps,
    ...rest,
  };

  const showCell = useBreakpointValue(
    typeof _isVisible === 'object' ? _isVisible : { base: _isVisible }
  );

  const cellWidth = useBreakpointValue(
    typeof _colWidth === 'object' ? _colWidth : { base: _colWidth }
  );

  if (!showCell) return null;

  const isWidthUnitless = /^[0-9.]+$/.test(cellWidth);

  return (
    <Flex
      direction="column"
      minW={!isWidthUnitless ? cellWidth : 0}
      flexBasis={isWidthUnitless ? `${+cellWidth * 100}%` : cellWidth}
      py="2"
      px="3"
      align="flex-start"
      justifyContent="center"
      {...cellProps}
    >
      {children}
    </Flex>
  );
};

export const DataListAccordion = ({ ...rest }) => {
  return <AccordionItem border="none" {...rest} />;
};

export const DataListAccordionButton = ({ ...rest }) => {
  return (
    <AccordionButton
      role="group"
      p="0"
      textAlign="left"
      _focus={{ outline: 'none' }}
      _hover={{}}
      {...rest}
    />
  );
};

export const DataListAccordionIcon = ({ ...rest }) => {
  return (
    <AccordionIcon
      borderRadius="full"
      _groupFocus={{ boxShadow: 'outline' }}
      {...rest}
    />
  );
};

export const DataListAccordionPanel = ({ ...rest }) => {
  return (
    <AccordionPanel boxShadow="inner" px="4" py="3" bg="gray.50" {...rest} />
  );
};

export interface DataListRowProps extends FlexProps {
  isVisible?: boolean | boolean[] | Record<string, boolean>;
  isDisabled?: boolean;
}

export const DataListRow: FC<DataListRowProps> = ({
  isVisible = true,
  isDisabled = false,
  ...rest
}) => {
  const bgColorHover = useColorModeValue('gray.50', 'blackAlpha.200');
  const borderColor = useColorModeValue('gray.100', 'gray.900');
  const { isHover } = useContext(DataListContext);
  const showRow = useBreakpointValue(
    typeof isVisible === 'object' ? isVisible : { base: isVisible }
  );
  const disabledProps: any = isDisabled
    ? {
        bg: 'gray.50',
        pointerEvents: 'none',
        _hover: {},
        _focus: {},
        'aria-disabled': true,
        opacity: '1 !important',
        css: {
          '> *': {
            opacity: 0.5,
          },
        },
      }
    : {};
  return (
    <Flex
      d={!showRow ? 'none' : null}
      position="relative"
      borderBottom="1px solid"
      borderBottomColor={borderColor}
      transition="0.2s"
      _hover={isHover ? { bg: bgColorHover } : null}
      {...disabledProps}
      {...rest}
    />
  );
};

export interface DataListHeaderProps extends DataListRowProps {}

export const DataListHeader: FC<DataListHeaderProps> = ({ ...rest }) => {
  const bgColor = useColorModeValue('gray.100', 'blackAlpha.400');
  return (
    <DataListHeaderContext.Provider value={true}>
      <DataListRow
        bg={bgColor}
        fontSize="sm"
        fontWeight="bold"
        color="gray.600"
        border="none"
        _hover={{}}
        {...rest}
      />
    </DataListHeaderContext.Provider>
  );
};

export interface DataListFooterProps extends DataListRowProps {}

export const DataListFooter: FC<DataListFooterProps> = ({ ...rest }) => {
  const bgColor = useColorModeValue('white', 'blackAlpha.50');
  const borderColor = useColorModeValue('gray.100', 'gray.900');
  return (
    <Box mt="auto">
      <Flex
        bg={bgColor}
        fontSize="sm"
        color="gray.600"
        mt="-1px"
        borderTop="1px solid"
        borderTopColor={borderColor}
        p="2"
        align="center"
        {...rest}
      />
    </Box>
  );
};

export interface DataListProps extends AccordionProps {
  isHover?: boolean;
}

export const DataList: FC<DataListProps> = ({
  allowMultiple = true,
  allowToggle = false,
  isHover = true,
  ...rest
}) => {
  const bgColor = useColorModeValue('white', 'blackAlpha.400');
  const [columns, setColumns] = useState({});
  return (
    <DataListContext.Provider
      value={{
        setColumns,
        columns,
        isHover,
      }}
    >
      <Accordion
        display="flex"
        flexDirection="column"
        bg={bgColor}
        position="relative"
        boxShadow="md"
        borderRadius="md"
        overflowX="auto"
        overflowY="hidden"
        minH="10rem"
        allowMultiple={allowMultiple && !allowToggle}
        allowToggle={allowToggle}
        {...rest}
      />
    </DataListContext.Provider>
  );
};
