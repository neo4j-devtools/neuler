# Neuler: The Graph Data Science Playground Release Notes

## 0.1.34 (2020-09-14)

* Save config of form across procedure runs
* Clearer explanation of the form parameters configured per algorithm run
* Updated startup flow to indicate when active graph is unavailable
* Fixed bug on scrolling form

## 0.1.33 (2020-09-08)

* Community Detection algorithms now return results grouped by community

## 0.1.32 (2020-09-08)

* Fix label rendering for similarity algos and some community detection/path finding

## 0.1.31 (2020-09-07)

* Fix bug in property selection for node labels

## 0.1.30 (2020-09-07)

* Introduce perspectives-light - a way to choose the properties shown per node label in the results table view
* Updated graph viz to differ between centrality and community detection

## 0.1.29 (2020-09-02)

* Add suggested algorithms to run on sample graphs
* Bug fix for visualisation screen

## 0.1.28 (2020-09-01)

* Updated launch sequence to explain missing dependencies

## 0.1.27 (2020-08-27)

* Show what's in the selected db on home screen
* Make sample graphs more prominent if db is empty
* Update instructions for installing missing GDS plugin

## 0.1.26 (2020-08-25)

* Added recipes sample graph
* Code view now includes named graph

## 0.1.25 (2020-07-14)

* Added K1-Coloring and Modularity Optimization

## 0.1.24 (2020-07-06)

* Update betweeness centrality for GDS 1.3
* Catch constraint already exists in Neo4j 4.x+
* Pull triangle count and local clustering coefficient into separate algorithms

## 0.1.23 (2020-06-26)

* Add feedback form

## 0.1.22 (2020-06-18)

* Refresh property keys, labels, and relationship types when changing database

## 0.1.21 (2020-06-16)

* Select database when using Neo4j 4.x

## 0.1.20 (2020-06-15)

* Added compatibility with GDS versions 1.1 and 1.2

## 0.1.19 (2020-06-04)

* Fix bug with LIMIT on streaming algorithms

## 0.1.18 (2020-05-12)

* Fix bug with return values of Louvain streaming algorithm

## 0.1.17 (2020-03-30)

* Limit the number of paths rendered in graph visualisation to `limit`

## 0.1.16 (2020-03-24)

* Updated to use the Graph Data Science Library

## 0.1.15 (2020-03-17)

* Release with new Neo4j Labs signing key

## 0.1.14 (2019-11-04)

* Fix issue with algorithm parameter rendering on latest version of Neo4j Browser

## 0.1.13 (2019-10-29)

- Fix issue with loading multiple sample datasets

## 0.1.12 (2019-05-17)

- Fix path issue with images

## 0.1.11 (2019-05-17)

- Redesign left menu to use icons
- Added European Roads and Twitter sample graphs
- Screenshot functionality

## 0.1.10 (2019-04-12)

- Similarity Algorithms
- Path Finding Algorithms
- Sample Graphs

## 0.1.9 (2019-03-25)

- Made it easier to remove properties from the table view

## 0.1.8 (2019-03-14)

- Eigenvector Centrality Algorithm
- Make visualisation node size and color configurable
- Initial unit and component testing

## 0.1.7 (2019-03-07)

- Degree Centrality Algorithm
- Preserve Visualisation on tab/page change
- Introduce basic charting
