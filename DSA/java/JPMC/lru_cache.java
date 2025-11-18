import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

/*
Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:

LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
int get(int key) Return the value of the key if the key exists, otherwise return -1.
void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.
The functions get and put must each run in O(1) average time complexity.
 */

class LRUCache {
    int capacity;
     Map<Integer,Integer> map=new LinkedHashMap<>();

     public LRUCache(int capacity) {
         this.capacity=capacity;
     }

     public int get(int key) {
         if(map.containsKey(key)){
             Integer val = map.get(key);
             map.remove(key);

             map.put(key,val);
             return map.get(key);
         }
         else return -1;
     }

     public void put(int key, int value) {
         if(map.containsKey(key)){
             map.remove(key);
             map.put(key,value);
         }
         else{
             if(map.size()<capacity){
                 map.put(key,value);
             }else{
                 // removing first element in the map.
                 Iterator<Integer> iterator = map.keySet().iterator();
                 map.remove(iterator.next());
                 map.put(key,value);
             }
         }
     }
 }

 /**
  * Your LRUCache object will be instantiated and called as such:
  * LRUCache obj = new LRUCache(capacity);
  * int param_1 = obj.get(key);
  * obj.put(key,value);
  */

/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache obj = new LRUCache(capacity);
 * int param_1 = obj.get(key);
 * obj.put(key,value);
 */
