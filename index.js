import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

// Keep this line for downwards compatibility with RN.
// eslint-disable-next-line react/forbid-foreign-prop-types

const Autocomplete = (props) => {
  const {
    containerStyle,
    flatListProps,
    hideResults,
    inputContainerStyle,
    keyboardShouldPersistTaps,
    keyExtractor,
    listContainerStyle,
    listStyle,
    onEndReached,
    onEndReachedThreshold,
    onShowResults,
    onStartShouldSetResponderCapture,
    renderItem,
    renderSeparator,
    renderTextInput: renderTextInputProp,
  } = props;

  const [data, setData] = useState(props.data);
  const resultList = useRef(null);
  const textInput = useRef(null);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  /**
   * Proxy `blur()` to autocomplete's text input.
   */
  const blur = () => {
    textInput && textInput.blur();
  };

  /**
   * Proxy `focus()` to autocomplete's text input.
   */
  const focus = () => {
    textInput && textInput.focus();
  };

  /**
   * Proxy `isFocused()` to autocomplete's text input.
   */
  const isFocused = () => {
    return textInput && textInput.isFocused();
  };

  const renderResultList = () => {
    return (
      <FlatList
        ref={resultList}
        data={data}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        renderSeparator={renderSeparator}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        style={[styles.list, listStyle]}
        {...flatListProps}
      />
    );
  };

  const renderTextInput = () => {
    const textInputProps = {
      ref: textInput,
      ...props
    };

    return renderTextInputProp(textInputProps);
  };

  const showResults = data.length > 0;

  // Notify listener if the suggestion will be shown.
  onShowResults && onShowResults(showResults);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputContainer, inputContainerStyle]}>
        {renderTextInput()}
      </View>
      {!hideResults && (
        <View
          style={listContainerStyle}
          onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
        >
          {showResults && renderResultList()}
        </View>
      )}
    </View>
  );
};

Autocomplete.propTypes = {
  ...TextInput.propTypes,
  /**
   * These styles will be applied to the container which
   * surrounds the autocomplete component.
   */
  containerStyle:  PropTypes.shape({
    style: PropTypes.any,
  }),
  /**
   * Assign an array of data objects which should be
   * rendered in respect to the entered text.
   */
  data: PropTypes.array,
  /**
   * Set to `true` to hide the suggestion list.
   */
  hideResults: PropTypes.bool,
  /*
   * These styles will be applied to the container which surrounds
   * the textInput component.
   */
  inputContainerStyle:  PropTypes.shape({
    style: PropTypes.any,
  }),
  /*
   * Set `keyboardShouldPersistTaps` to true if RN version is <= 0.39.
   */
  keyboardShouldPersistTaps: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]),
  /*
   * These styles will be applied to the container which surrounds
   * the result list.
   */
  listContainerStyle:  PropTypes.shape({
    style: PropTypes.any,
  }),
  /**
   * These style will be applied to the result list.
   */
  listStyle:  PropTypes.shape({
    style: PropTypes.any,
  }),
  /**
   * `onShowResults` will be called when list is going to
   * show/hide results.
   */
  onShowResults: PropTypes.func,
  /**
   * method for intercepting swipe on ListView. Used for ScrollView support on Android
   */
  onStartShouldSetResponderCapture: PropTypes.func,
  /**
   * `renderItem` will be called to render the data objects
   * which will be displayed in the result view below the
   * text input.
   */
  renderItem: PropTypes.func,
  keyExtractor: PropTypes.func,
  /**
   * `renderSeparator` will be called to render the list separators
   * which will be displayed between the list elements in the result view
   * below the text input.
   */
  renderSeparator: PropTypes.func,
  /**
   * renders custom TextInput. All props passed to this function.
   */
  renderTextInput: PropTypes.func,
  flatListProps: PropTypes.object
};

Autocomplete.defaultProps = {
  data: [],
  defaultValue: '',
  keyboardShouldPersistTaps: 'always',
  onStartShouldSetResponderCapture: () => false,
  renderItem: ({ item }) => <Text>{item}</Text>,
  renderSeparator: null,
  renderTextInput: props => {
    const { style, ...rest } = props;
    return <TextInput style={[styles.input, style]} {...rest} />
  },
  flatListProps: {}
};

const border = {
  borderColor: '#b9b9b9',
  borderRadius: 1,
  borderWidth: 1
};

const androidStyles = {
  container: {
    flex: 1
  },
  inputContainer: {
    ...border,
    marginBottom: 0
  },
  list: {
    ...border,
    backgroundColor: 'white',
    borderTopWidth: 0,
    margin: 10,
    marginTop: 0
  }
};

const iosStyles = {
  container: {
    zIndex: 1
  },
  inputContainer: {
    ...border
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 3
  },
  list: {
    ...border,
    backgroundColor: 'white',
    borderTopWidth: 0,
    left: 0,
    position: 'absolute',
    right: 0
  }
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 3
  },
  ...Platform.select({
    android: { ...androidStyles },
    ios: { ...iosStyles }
  })
});

export default Autocomplete;
