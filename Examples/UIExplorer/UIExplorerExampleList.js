/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

const ListView = require('ListView');
const React = require('react');
const StyleSheet = require('StyleSheet');
const Text = require('Text');
const TextInput = require('TextInput');
const TouchableHighlight = require('TouchableHighlight');
const View = require('View');
const UIExplorerActions = require('./UIExplorerActions');

const createExamplePage = require('./createExamplePage');

import type {
  UIExplorerExample,
} from './UIExplorerList.ios';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (h1, h2) => h1 !== h2,
});

class UIExplorerExampleList extends React.Component {
  constuctor(props: {
    disableTitleRow: ?boolean,
    onNavigate: Function,
    filter: ?string,
    list: {
      ComponentExamples: Array<UIExplorerExample>,
      APIExamples: Array<UIExplorerExample>,
    },
    style: ?any,
  }) {

  }

  static makeRenderable(example: any): ReactClass<any> {
    return example.examples ?
      createExamplePage(null, example) :
      example;
  }

  render(): ?ReactElement<any> {
    const filterText = this.props.filter || '';
    const filterRegex = new RegExp(String(filterText), 'i');
    const filter = (example) => filterRegex.test(example.module.title);

    const dataSource = ds.cloneWithRowsAndSections({
      components: this.props.list.ComponentExamples.filter(filter),
      apis: this.props.list.APIExamples.filter(filter),
    });
    return (
      <View style={[styles.listContainer, this.props.style]}>
        {this._renderTitleRow()}
        {this._renderTextInput()}
        <ListView
          style={styles.list}
          dataSource={dataSource}
          renderRow={this._renderExampleRow.bind(this)}
          renderSectionHeader={this._renderSectionHeader}
          enableEmptySections={true}
          keyboardShouldPersistTaps={true}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode="on-drag"
        />
      </View>
    );
  }

  _renderTitleRow(): ?ReactElement<any> {
    if (!this.props.displayTitleRow) {
      return null;
    }
    return this._renderRow(
      'UIExplorer',
      'React Native Examples',
      'home_key',
      () => {
        this.props.onNavigate(
          UIExplorerActions.ExampleListWithFilter('')
        );
      }
    );
  }

  _renderTextInput(): ?ReactElement<any> {
    if (this.props.disableSearch) {
      return null;
    }
    return (
      <View style={styles.searchRow}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          onChangeText={text => {
            this.props.onNavigate(UIExplorerActions.ExampleListWithFilter(text));
          }}
          placeholder="Search..."
          style={[styles.searchTextInput, this.props.searchTextInputStyle]}
          testID="explorer_search"
          value={this.props.filter}
        />
      </View>
    );
  }

  _renderSectionHeader(data: any, section: string): ?ReactElement<any> {
    return (
      <Text style={styles.sectionHeader}>
        {section.toUpperCase()}
      </Text>
    );
  }

  _renderExampleRow(example: {key: string, module: Object}): ?ReactElement<any> {
    return this._renderRow(
      example.module.title,
      example.module.description,
      example.key,
      () => this._handleRowPress(example.key)
    );
  }

  _renderRow(title: string, description: string, key: ?string, handler: ?Function): ?ReactElement<any> {
    return (
      <View key={key || title}>
        <TouchableHighlight onPress={handler}>
          <View style={styles.row}>
            <Text style={styles.rowTitleText}>
              {title}
            </Text>
            <Text style={styles.rowDetailText}>
              {description}
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.separator} />
      </View>
    );
  }

  _handleRowPress(exampleKey: string): void {
    this.props.onNavigate(UIExplorerActions.ExampleAction(exampleKey));
  }
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  list: {
    backgroundColor: '#eeeeee',
  },
  sectionHeader: {
    padding: 5,
    fontWeight: '500',
    fontSize: 11,
  },
  group: {
    backgroundColor: 'white',
  },
  row: {
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#bbbbbb',
    marginLeft: 15,
  },
  rowTitleText: {
    fontSize: 17,
    fontWeight: '500',
  },
  rowDetailText: {
    fontSize: 15,
    color: '#888888',
    lineHeight: 20,
  },
  searchRow: {
    backgroundColor: '#eeeeee',
    padding: 10,
  },
  searchTextInput: {
    backgroundColor: 'white',
    borderColor: '#cccccc',
    borderRadius: 3,
    borderWidth: 1,
    paddingLeft: 8,
    height: 35,
  },
});

module.exports = UIExplorerExampleList;
